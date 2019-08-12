import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import { cloneDeep, isEmpty } from 'lodash'
import moment from 'moment'
import transactions, * as fromTransactions from './transactionsAccounts'
import login, * as fromLogin from './login'
import graph, * as fromGraph from './graph'
import grid, * as fromGrid from './grid'
import {
  TRANSACTIONS,
  LOGIN,
  GRAPH,
  GRID,
  INPUT,
  OUTPUT,
  CATEGORY,
  AMOUNT,
  NAME,
  DAY,
  YEAR,
  MONTH,
  WEEK,
} from '../konstants'
import { Transaction as PlaidTransaction } from 'plaid'
import {
  getTypeOfCard,
  shouldKeepTransaction,
  getOrderedDates,
} from '../utilities/utils'
import { PileaCard, DBItem } from '../sagas/sagas'

const reducers = combineReducers({
  transactions,
  login,
  graph,
  grid,
})
export default reducers

/***********
 * BASE SELECTORS
 ***********/

//transactions
export const transactionsSelector = state =>
  fromTransactions.transactionsSelector(state[TRANSACTIONS])
export const cardsSelector = state =>
  fromTransactions.cardsSelector(state[TRANSACTIONS])
export const itemsSelector = state =>
  fromTransactions.itemsSelector(state[TRANSACTIONS])

//log in
export const accessTokensSelector = state =>
  fromLogin.accessTokensSelector(state[LOGIN])
export const loggedInSelector = state =>
  fromLogin.loggedInSelector(state[LOGIN])
export const userSelector = state => fromLogin.userSelector(state[LOGIN])

//graph
export const graphFidelitySelector = state =>
  fromGraph.graphFidelitySelector(state[GRAPH])
export const graphHistoricalLengthSelector = state =>
  fromGraph.graphHistoricalLengthSelector(state[GRAPH])

//grid
export const selectedTransactionKeySelector = state => {
  return fromGrid.selectedTransactionKeySelector(state[GRID])
}

/***********
 * TRANSFORMATION SELECTORS
 ***********/

// Filtering
export const allowedCardsSelector: (
  state
) => { [key: string]: boolean } = createSelector(
  cardsSelector,
  cards => {
    const allowedCards = cards.reduce((acc, card) => {
      if (card.selected) {
        acc[card.account_id] = true
      }

      return acc
    }, {})

    return allowedCards
  }
)

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

export interface ItemWithCards extends fromTransactions.ItemWithFilter {
  cards: fromTransactions.CardWithFilter[]
}

export const transactionsNoIntraAccountSelector: (
  state
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

export const filteredTransactionsSelector: (
  state
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

export const dailyTransactionsSelector: (
  state
) => DailyTransactions = createSelector(
  filteredTransactionsSelector,
  transactions => {
    const uniqueDates = [...new Set(transactions.map(tx => tx.date))].reduce(
      (acc, cur) => {
        acc[cur] = []
        return acc
      },
      {}
    )
    const txByDates = transactions.reduce(
      (acc, cur) => {
        const { date } = cur

        acc[date].push(cur)
        return acc
      },
      uniqueDates as DailyTransactions
    )

    return txByDates
  }
)

export const transactionsByDateInputOutputSelector: (
  state
) => TimeConsolidatedTransactionGroups = createSelector(
  dailyTransactionsSelector,
  transactions => {
    return Object.keys(transactions).reduce((finalResult, date) => {
      finalResult[date] = transactions[date].reduce(
        (dailyInfo, tx) => {
          const { cardType, amount } = tx

          if (cardType === 'credit' && amount >= 0) {
            dailyInfo.output += amount
          }
          if (cardType === 'credit' && amount <= 0) {
            dailyInfo.input += -amount
          }
          if (cardType === 'depository' && amount >= 0) {
            dailyInfo.output += amount
          }
          if (cardType === 'depository' && amount <= 0) {
            dailyInfo.input += -amount
          }

          dailyInfo.transactions.push(tx)

          return dailyInfo
        },
        {
          input: 0,
          output: 0,
          transactions: [],
        } as TimeConsolidatedTransactionGroup
      )
      return finalResult
    }, {})
  }
)

export const transactionsByDayCountCombinedSelector: (
  state
) => TimeConsolidatedTransactionGroups = createSelector(
  transactionsByDateInputOutputSelector,
  graphFidelitySelector,
  graphHistoricalLengthSelector,
  (transactions, fidelity, { historicalTimeCount, historicalTimeUnit }) => {
    const { orderedDatesArray, orderedDatesMap } = getOrderedDates(
      fidelity,
      historicalTimeCount,
      historicalTimeUnit
    )

    console.log(orderedDatesArray, orderedDatesMap)

    //sort transactions into ordered dates
    return Object.entries(transactions).reduce(
      (acc, [date, transactionGroup]) => {
        // find the first date in orderedDates that comes before the transaction
        const foundDate = orderedDatesArray.find(
          orderedDate => moment(orderedDate).valueOf() < moment(date).valueOf()
        )

        if (foundDate) {
          acc[foundDate].input += transactionGroup.input
          acc[foundDate].output += transactionGroup.output
          acc[foundDate].transactions = [
            ...acc[foundDate].transactions,
            ...transactionGroup.transactions,
          ]
        }

        return acc
      },
      orderedDatesMap as TimeConsolidatedTransactionGroups
    )
  }
)

export const selectedTransactionsSelector: (
  state
) => TimeConsolidatedTransactionGroup = createSelector(
  transactionsByDayCountCombinedSelector,
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

export const transactionsByCategorySelector = createSelector(
  transactionsNoIntraAccountSelector,
  transactions =>
    transactions.reduce((acc, cur) => {
      if (!cur[CATEGORY]) {
        return acc
      }

      const category = cur[CATEGORY][0]

      if (acc[category]) {
        acc[category][AMOUNT] += cur[AMOUNT]
        acc[category][TRANSACTIONS].push(cur)
      } else {
        acc[category] = {
          [AMOUNT]: cur[AMOUNT],
          [TRANSACTIONS]: [cur],
        }
      }

      return acc
    }, {})
)

export const transactionsByNameSelector = createSelector(
  transactionsNoIntraAccountSelector,
  transactions =>
    transactions.reduce((acc, cur) => {
      if (!cur[NAME]) {
        return acc
      }

      const name = cur[NAME]

      if (acc[name]) {
        acc[name][AMOUNT] += cur[AMOUNT]
        acc[name][TRANSACTIONS].push(cur)
      } else {
        acc[name] = {
          [AMOUNT]: cur[AMOUNT],
          [TRANSACTIONS]: [cur],
        }
      }

      return acc
    }, {})
)

export const transactionsBycardsSelector: (
  state
) => TxGroupedByDateAndCards = createSelector(
  dailyTransactionsSelector,
  transactions => {
    return Object.keys(transactions).reduce((result, date) => {
      result[date] = transactions[date].reduce((acc, cur) => {
        acc[cur.account_id]
          ? acc[cur.account_id].push(cur)
          : (acc[cur.account_id] = [cur])
        return acc
      }, {})

      return result
    }, {})
  }
)

// Card combination

export const cardsByItemsSelector: (state) => ItemWithCards[] = createSelector(
  cardsSelector,
  itemsSelector,
  (cards, items) => {
    return items.map(item => ({
      ...item,
      cards: cards.filter(card => card.itemId === item.id),
    }))
  }
)
