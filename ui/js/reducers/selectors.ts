import { Transaction as PlaidTransaction } from 'plaid'
import moment = require('moment')
import { isEmpty } from 'lodash'
import { createSelector } from 'reselect'

import { RootState } from '.'
import {
  getTypeOfCard,
  shouldKeepTransaction,
  getOrderedDates,
} from '../utilities/utils'
import {
  cardsSelector,
  ItemWithFilter,
  CardWithFilter,
  transactionsSelector,
  categoriesSelector,
  itemsSelector,
} from './transactionsAccounts'
import { graphHistoricalLengthSelector, graphFidelitySelector } from './graph'
import { selectedTransactionKeySelector } from './grid'
import { YEAR, MONTH, WEEK, INPUT, OUTPUT } from '../konstants'

// Graph
const orderedDatesSelector: (state: RootState) => string[] = createSelector(
  graphFidelitySelector,
  graphHistoricalLengthSelector,
  (fidelity, { historicalTimeCount, historicalTimeUnit }) => {
    const totalDaysInHistoricalLength =
      historicalTimeCount *
      (historicalTimeUnit === YEAR
        ? 365
        : historicalTimeUnit === MONTH
        ? 31
        : historicalTimeUnit === WEEK
        ? 7
        : 1)

    const countDataPoints = Math.floor(
      totalDaysInHistoricalLength /
        (fidelity === YEAR
          ? 365
          : fidelity === MONTH
          ? 30
          : fidelity === WEEK
          ? 7
          : 1)
    )

    // ordered dates from current to past
    const orderedDatesArray = Array(countDataPoints)
      .fill(null)
      .map((_, i) =>
        moment()
          .subtract(i + 1, fidelity)
          .format('YYYY-MM-DD')
      )

    return orderedDatesArray
  }
)

// Filtering
export const allowedCardsSelector: (
  state: RootState
) => { [key: string]: boolean } = createSelector(cardsSelector, cards => {
  const allowedCards = cards.reduce((acc, card) => {
    if (card.selected) {
      acc[card.account_id] = true
    }

    return acc
  }, {} as { [key: string]: boolean })

  return allowedCards
})

// transaction filtering and combination
export interface TxWithCardType extends PlaidTransaction {
  cardType: string
}

export interface DailyTransactions {
  [uniqueDate: string]: TxWithCardType[]
}

export interface TimeConsolidatedTransactionGroup {
  input: number
  output: number
  transactions: TxWithCardType[]
}

export interface TimeConsolidatedTransactionGroups {
  [key: string]: TimeConsolidatedTransactionGroup
}

export interface TxGroupedByDateAndCards {
  [date: string]: {
    [card: string]: TxWithCardType[]
  }
}

export interface ItemWithCards extends ItemWithFilter {
  cards: CardWithFilter[]
}

export const transactionsNoIntraAccountSelector: (
  state: RootState
) => TxWithCardType[] = createSelector(
  transactionsSelector,
  cardsSelector,
  (transactions, cards) => {
    return transactions
      .map(tx => ({
        ...tx,
        cardType: getTypeOfCard({
          id: tx.account_id,
          cards,
        }),
      }))
      .filter(({ cardType, ...tx }) => {
        return shouldKeepTransaction(tx, cardType)
      })
  }
)

export const cardAndTimeFilteredTransactionsSelector: (
  state: RootState
) => TxWithCardType[] = createSelector(
  transactionsNoIntraAccountSelector,
  graphHistoricalLengthSelector,
  allowedCardsSelector,
  (transactions, { historicalTimeCount, historicalTimeUnit }, allowedCards) => {
    const cutOffDate = moment()
      .subtract(historicalTimeCount, historicalTimeUnit)
      .valueOf()

    // No need to also filter item due to 1:m relationship
    return transactions.filter(
      tx =>
        moment(tx.date).valueOf() > cutOffDate && allowedCards[tx.account_id]
    )
  }
)

export const categoryFilteredTransactionsSelector: (
  state: RootState
) => TxWithCardType[] = createSelector(
  cardAndTimeFilteredTransactionsSelector,
  categoriesSelector,
  (transactions, categories) => {
    return transactions.filter(tx => {
      const keepTx = tx.category.reduce((acc, cur) => {
        if (!categories[cur]) {
          acc = false
        }
        return acc
      }, true as boolean)
      return keepTx
    })
  }
)

export const timeConsolidatedTransactionsSelector: (
  state: RootState
) => TimeConsolidatedTransactionGroups = createSelector(
  categoryFilteredTransactionsSelector,
  orderedDatesSelector,
  (transactions, orderedDates) => {
    const txsGroupedByDate = transactions.reduce((acc, transaction) => {
      const foundDate = orderedDates.find(
        orderedDate =>
          moment(orderedDate).valueOf() < moment(transaction.date).valueOf()
      )

      // find the first date in orderedDates that comes before the transaction
      if (foundDate) {
        if (!acc[foundDate]) {
          acc[foundDate] = {
            input: 0,
            output: 0,
            transactions: [],
          }
        }

        const { cardType, amount } = transaction

        if (cardType === 'credit' && amount >= 0) {
          acc[foundDate].output += amount
        }
        if (cardType === 'credit' && amount <= 0) {
          acc[foundDate].input += -amount
        }
        if (cardType === 'depository' && amount >= 0) {
          acc[foundDate].output += amount
        }
        if (cardType === 'depository' && amount <= 0) {
          acc[foundDate].input += -amount
        }

        acc[foundDate].transactions.push(transaction)
      }

      return acc
    }, {} as TimeConsolidatedTransactionGroups)

    return txsGroupedByDate
  }
)

export interface GraphLineSeries {
  incomeSeries: Array<{ x: number; y: number }>
  spendingSeries: Array<{ x: number; y: number }>
}

export const lineSeriesSelector: (
  state: RootState
) => GraphLineSeries = createSelector(
  timeConsolidatedTransactionsSelector,
  transactionGroups => {
    return Object.entries(transactionGroups).reduce(
      (result, [date, txs]) => {
        const unixMiliStamp = moment(date, 'YYYY-MM-DD', true).valueOf()

        result.incomeSeries.push({
          x: unixMiliStamp,
          y: txs[INPUT],
        })

        result.spendingSeries.push({
          x: unixMiliStamp,
          y: txs[OUTPUT],
        })

        return result
      },
      {
        incomeSeries: [],
        spendingSeries: [],
      }
    )
  }
)

export const selectedTransactionsSelector: (
  state: RootState
) => TimeConsolidatedTransactionGroup = createSelector(
  timeConsolidatedTransactionsSelector,
  selectedTransactionKeySelector,
  (transactions, selectedKey) => {
    return isEmpty(transactions) || selectedKey === ''
      ? {
          input: 0,
          output: 0,
          transactions: [],
        }
      : transactions[selectedKey]
  }
)

// Card combination

export const itemsWithCardsSelector: (
  state: RootState
) => ItemWithCards[] = createSelector(
  cardsSelector,
  itemsSelector,
  (cards, items) => {
    return items.map(item => ({
      ...item,
      cards: cards.filter(card => card.itemId === item.id),
    }))
  }
)

// Categories
export interface CategoriesWithTxData {
  [key: string]: {
    selected: boolean
    spending: number
    txCount: number
  }
}

export const categoryDataSelector: (
  state: RootState
) => CategoriesWithTxData = createSelector(
  cardAndTimeFilteredTransactionsSelector,
  categoriesSelector,

  (transactions, categories) => {
    const categoriesSetUp: CategoriesWithTxData = Object.entries(
      categories
    ).reduce(
      (acc, [category, selected]) => ({
        ...acc,
        [category]: {
          selected,
          spending: 0,
          txCount: 0,
        },
      }),
      {} as CategoriesWithTxData
    )

    return transactions.reduce((acc, tx) => {
      tx.category.forEach(category => {
        acc[category].spending += tx.amount
        acc[category].txCount += 1
      })

      return acc
    }, categoriesSetUp)
  }
)
