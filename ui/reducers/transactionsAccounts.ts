import {
  SET_TRANSACTIONS,
  TRANSACTIONS,
  RESET_TRANSACTIONS,
  CARDS,
  ITEMS,
  SET_CARDS,
  SET_ITEMS,
  TOGGLE_CARD_SELECTED,
  TOGGLE_ITEM_SELECTED,
} from '../konstants'
import { updateIn, set, setIn } from 'timm'
import { Transaction as PlaidTransaction, Account as PlaidCard } from 'plaid'
import { DBItem, PileaCard } from '../sagas/sagas'
import { AccountsInterfaces, TransactionsInterfaces } from '../actions'

export interface CardWithFilter extends PileaCard {
  selected: boolean
}
export interface ItemWithFilter extends DBItem {
  selected: boolean
}

export interface TransactionsAccountsState {
  [TRANSACTIONS]: PlaidTransaction[]
  [CARDS]: CardWithFilter[]
  [ITEMS]: ItemWithFilter[]
}

const initialState: TransactionsAccountsState = {
  [TRANSACTIONS]: [],
  [CARDS]: [],
  [ITEMS]: [],
}

const transactions: (
  state: TransactionsAccountsState,
  action: AccountsInterfaces | TransactionsInterfaces
) => TransactionsAccountsState = (state = initialState, action) => {
  let newState: TransactionsAccountsState

  switch (action.type) {
    case SET_TRANSACTIONS: {
      newState = updateIn(state, [TRANSACTIONS], list => [
        ...list,
        ...action.payload,
      ])
      break
    }
    case SET_CARDS: {
      newState = updateIn(state, [CARDS], existingCards => {
        return action.payload.reduce(
          (acc, newCard) => {
            if (
              !acc.find(
                existCard => existCard.account_id === newCard.account_id
              )
            ) {
              acc.push({ ...newCard, selected: true } as CardWithFilter)
            }
            return acc
          },
          [...existingCards] as PlaidCard[]
        )
      })
      break
    }
    case SET_ITEMS: {
      newState = setIn(
        state,
        [ITEMS],
        action.payload.map(
          (item: DBItem): ItemWithFilter => ({ ...item, selected: true })
        )
      )
      break
    }

    case RESET_TRANSACTIONS: {
      newState = set(state, TRANSACTIONS, [])
      break
    }

    case TOGGLE_CARD_SELECTED: {
      const foundCardIndex = state[CARDS].findIndex(
        card => card.account_id === action.payload
      )

      newState = updateIn(
        state,
        [CARDS, foundCardIndex],
        (oldCard: CardWithFilter): CardWithFilter => ({
          ...oldCard,
          selected: !oldCard.selected,
        })
      )
      break
    }

    case TOGGLE_ITEM_SELECTED: {
      const foundItemIndex = state[ITEMS].findIndex(
        item => item.id === action.payload
      )

      const selected = !state[ITEMS][foundItemIndex].selected

      newState = updateIn(
        state,
        [ITEMS, foundItemIndex],
        (oldItem: ItemWithFilter): ItemWithFilter => ({
          ...oldItem,
          selected,
        })
      )

      // toggling an item also sets all cards under that item to also be the same as the new selected value
      newState = updateIn(
        newState,
        [CARDS],
        (oldCards: CardWithFilter[]): CardWithFilter[] =>
          oldCards.map(oldCard => ({
            ...oldCard,
            ...(oldCard.itemId === action.payload ? { selected } : {}),
          }))
      )
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
) => CardWithFilter[] = state => state[CARDS]

export const itemsSelector: (
  state: typeof initialState
) => ItemWithFilter[] = state => state[ITEMS]
