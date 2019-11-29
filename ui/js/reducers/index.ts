import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import { isEmpty } from 'lodash'
import moment from 'moment'
import { Transaction as PlaidTransaction } from 'plaid'

import {
  TRANSACTIONS,
  LOGIN,
  GRAPH,
  GRID,
  LOADING,
  NOTIFICATIONS,
} from '../konstants'
import {
  getTypeOfCard,
  shouldKeepTransaction,
  getOrderedDates,
} from '../utilities/utils'
import transactions, * as fromTransactions from './transactionsAccounts'
import login, * as fromLogin from './login'
import graph, * as fromGraph from './graph'
import grid, * as fromGrid from './grid'
import loading, * as fromLoading from './loading'
import notifications, * as fromNotifications from './notifications'

export interface RootState {
  [TRANSACTIONS]: fromTransactions.TransactionsAccountsState
  [LOGIN]: fromLogin.LoginState
  [GRAPH]: fromGraph.GraphState
  [GRID]: fromGrid.GridState
  [LOADING]: fromLoading.LoadingState
  [NOTIFICATIONS]: fromNotifications.NotificationsState
}

const reducers = combineReducers({
  transactions,
  login,
  graph,
  grid,
  loading,
  notifications,
})
export default reducers

/***********
 * BASE SELECTORS
 ***********/
//loading
export const isLoginLoadingSelector = (state: RootState) =>
  fromLoading.isLoginLoadingSelector(state[LOADING])
export const isTransactionsLoadingSelector = (state: RootState) =>
  fromLoading.isTransactionsLoadingSelector(state[LOADING])
export const isAnythingLoadingSelector = (state: RootState) =>
  fromLoading.isAnythingLoadingSelector(state[LOADING])

//transactions
export const transactionsSelector = (state: RootState) =>
  fromTransactions.transactionsSelector(state[TRANSACTIONS])
export const cardsSelector = (state: RootState) =>
  fromTransactions.cardsSelector(state[TRANSACTIONS])
export const itemsSelector = (state: RootState) =>
  fromTransactions.itemsSelector(state[TRANSACTIONS])
export const categoriesSelector = (state: RootState) =>
  fromTransactions.categoriesSelector(state[TRANSACTIONS])

//log in
export const loggedInSelector = (state: RootState) =>
  fromLogin.loggedInSelector(state[LOGIN])
export const userSelector = (state: RootState) =>
  fromLogin.userSelector(state[LOGIN])

//graph
export const graphFidelitySelector = (state: RootState) =>
  fromGraph.graphFidelitySelector(state[GRAPH])
export const graphHistoricalLengthSelector = (state: RootState) =>
  fromGraph.graphHistoricalLengthSelector(state[GRAPH])

//grid
export const selectedTransactionKeySelector = (state: RootState) => {
  return fromGrid.selectedTransactionKeySelector(state[GRID])
}

//notifications
export const activeNotificationsSelector = (state: RootState) => {
  return fromNotifications.activeNotificationsSelector(state[NOTIFICATIONS])
}
export const expiredNotificationsSelector = (state: RootState) =>
  fromNotifications.expiredNotificationsSelector(state[NOTIFICATIONS])

/***********
 * TRANSFORMATION SELECTORS
 ***********/

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

export interface ItemWithCards extends fromTransactions.ItemWithFilter {
  cards: fromTransactions.CardWithFilter[]
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

export const dailyTransactionsSelector: (
  state: RootState
) => DailyTransactions = createSelector(
  categoryFilteredTransactionsSelector,
  transactions => {
    const uniqueDates = [...new Set(transactions.map(tx => tx.date))].reduce(
      (acc, cur) => {
        acc[cur] = []
        return acc
      },
      {} as DailyTransactions
    )
    const txByDates = transactions.reduce((acc, cur) => {
      const { date } = cur

      acc[date].push(cur)
      return acc
    }, uniqueDates as DailyTransactions)

    return txByDates
  }
)

export const transactionsByDateInputOutputSelector: (
  state: RootState
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
    }, {} as TimeConsolidatedTransactionGroups)
  }
)

export const transactionsByDayCountCombinedSelector: (
  state: RootState
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
  state: RootState
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

// export const transactionsByCategorySelector = createSelector(
//   transactionsNoIntraAccountSelector,
//   transactions =>
//     transactions.reduce((acc, cur) => {
//       if (!cur[CATEGORY]) {
//         return acc
//       }

//       const category = cur[CATEGORY][0]

//       if (acc[category]) {
//         acc[category][AMOUNT] += cur[AMOUNT]
//         acc[category][TRANSACTIONS].push(cur)
//       } else {
//         acc[category] = {
//           [AMOUNT]: cur[AMOUNT],
//           [TRANSACTIONS]: [cur],
//         }
//       }

//       return acc
//     }, {})
// )

// export const transactionsByNameSelector = createSelector(
//   transactionsNoIntraAccountSelector,
//   transactions =>
//     transactions.reduce((acc, cur) => {
//       if (!cur[NAME]) {
//         return acc
//       }

//       const name = cur[NAME]

//       if (acc[name]) {
//         acc[name][AMOUNT] += cur[AMOUNT]
//         acc[name][TRANSACTIONS].push(cur)
//       } else {
//         acc[name] = {
//           [AMOUNT]: cur[AMOUNT],
//           [TRANSACTIONS]: [cur],
//         }
//       }

//       return acc
//     }, {})
// )

export const transactionsBycardsSelector: (
  state: RootState
) => TxGroupedByDateAndCards = createSelector(
  dailyTransactionsSelector,
  transactions => {
    return Object.keys(transactions).reduce((result, date) => {
      result[date] = transactions[date].reduce(
        (acc, cur) => {
          acc[cur.account_id]
            ? acc[cur.account_id].push(cur)
            : (acc[cur.account_id] = [cur])
          return acc
        },
        {} as {
          [card: string]: TxWithCardType[]
        }
      )

      return result
    }, {} as TxGroupedByDateAndCards)
  }
)

// Card combination

export const cardsByItemsSelector: (
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
