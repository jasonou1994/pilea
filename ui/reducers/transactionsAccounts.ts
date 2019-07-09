import { createSelector } from 'reselect'
import {
  SET_TRANSACTIONS,
  TRANSACTIONS,
  RESET_TRANSACTIONS,
  AMOUNT,
  CATEGORY,
  NAME,
  CARDS,
  ITEMS,
  SET_CARDS,
  SET_ITEMS,
  LAST_UPDATED,
} from '../konstants'
import { shouldKeepTransaction } from '../utils'
import { updateIn, set, update } from 'timm'
import { Transaction as PlaidTransaction, Account as PlaidCard } from 'plaid'
import { DBItem, PileaCard } from '../sagas/sagas'
import { TransactionsActionTypes, AccountsActionTypes } from '../actions'

const initialState = {
  [TRANSACTIONS]: [] as PlaidTransaction[],
  [CARDS]: [] as PileaCard[],
  [ITEMS]: [] as DBItem[],
  [LAST_UPDATED]: '',
}

const transactions: (
  state: typeof initialState,
  {
    type,
    payload,
  }: { type: TransactionsActionTypes | AccountsActionTypes; payload }
) => typeof initialState = (state = initialState, { type, payload }) => {
  let newState: typeof initialState

  switch (type) {
    case SET_TRANSACTIONS: {
      console.log('before', state[TRANSACTIONS])
      console.log('payload', payload)
      newState = update(state, TRANSACTIONS, list => {
        list.push(...payload)
        return list
      })
      console.log('after', newState[TRANSACTIONS])
      break
    }
    case SET_CARDS: {
      newState = updateIn(state, [CARDS], existingCards => {
        return (payload as PlaidCard[]).reduce(
          (acc, newCard) => {
            if (
              !acc.find(
                existCard => existCard.account_id === newCard.account_id
              )
            ) {
              acc.push(newCard)
            }
            return acc
          },
          existingCards as PlaidCard[]
        )
      })
      break
    }
    case SET_ITEMS: {
      newState = updateIn(state, [ITEMS], _ => [...payload])
      break
    }

    case RESET_TRANSACTIONS: {
      newState = set(state, TRANSACTIONS, [])
      break
    }
    default: {
      newState = state
    }
  }

  return newState
}
export default transactions

export const getTypeOfAccount = ({ accounts, id }) => {
  const account = accounts.find(account => account.account_id === id)

  return account ? account.type : null
}
export const getAccountName = ({ accounts, id }) => {
  const account = accounts.find(account => account.account_id === id)

  return account
    ? account.official_name
      ? account.official_name
      : account.name
    : null
}

export const transactionsSelector = (state: typeof initialState) =>
  state[TRANSACTIONS]
export const cardsSelector = (state: typeof initialState) => state[CARDS]
export const itemsSelector = (state: typeof initialState) => state[ITEMS]

export const transactionsNoIntraAccountSelector = createSelector(
  transactionsSelector,
  cardsSelector,
  (transactions, accounts) => {
    return transactions
      .map(tx => ({
        ...tx,
        accountType: getTypeOfAccount({
          id: tx.account_id,
          accounts,
        }),
      }))
      .filter(({ accountType, ...tx }) => {
        console.log(tx)
        return shouldKeepTransaction(tx, accountType)
      })
  }
)

export const dailyTransactionsSelector = createSelector(
  transactionsNoIntraAccountSelector,
  transactions => {
    // @ts-ignore
    const uniqueDates = [...new Set(transactions.map(tx => tx.date))].reduce(
      (acc, cur) => {
        acc[cur] = []
        return acc
      },
      {}
    )
    const txByDates = transactions.reduce((acc, cur) => {
      const { date } = cur

      acc[date].push(cur)
      return acc
    }, uniqueDates)

    return txByDates
  }
)

export const transactionsByDateInputOutputSelector = createSelector(
  dailyTransactionsSelector,
  transactions => {
    return Object.keys(transactions).reduce((finalResult, date) => {
      finalResult[date] = transactions[date].reduce(
        (dailyInfo, tx) => {
          const { accountType, amount } = tx

          if (accountType === 'credit' && amount >= 0) {
            dailyInfo.output += amount
          }
          if (accountType === 'credit' && amount <= 0) {
            dailyInfo.input += -amount
          }
          if (accountType === 'depository' && amount >= 0) {
            dailyInfo.output += amount
          }
          if (accountType === 'depository' && amount <= 0) {
            dailyInfo.input += -amount
          }

          dailyInfo.transactions.push(tx)

          return dailyInfo
        },
        {
          input: 0,
          output: 0,
          transactions: [],
        }
      )
      return finalResult
    }, {})
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

export const transactionsBycardsSelector = createSelector(
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

export interface ItemWithCards extends DBItem {
  cards: PileaCard[]
}

export const cardsByItemsSelector = createSelector(
  cardsSelector,
  itemsSelector,
  (cards, items) => {
    return items.map(item => ({
      ...item,
      cards: cards.filter(card => card.itemId === item.id),
    }))
  }
)
