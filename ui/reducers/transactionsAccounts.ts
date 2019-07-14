import { createSelector } from 'reselect'
import {
  SET_TRANSACTIONS,
  TRANSACTIONS,
  RESET_TRANSACTIONS,
  CARDS,
  ITEMS,
  SET_CARDS,
  SET_ITEMS,
  LAST_UPDATED,
} from '../konstants'
import { shouldKeepTransaction } from '../utilities/utils'
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
      newState = updateIn(state, [TRANSACTIONS], list => [...list, ...payload])
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

export const transactionsSelector: (
  state: typeof initialState
) => PlaidTransaction[] = state => state[TRANSACTIONS]

export const cardsSelector: (
  state: typeof initialState
) => PileaCard[] = state => state[CARDS]

export const itemsSelector: (state: typeof initialState) => DBItem[] = state =>
  state[ITEMS]
