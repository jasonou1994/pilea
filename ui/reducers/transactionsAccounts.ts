import {
  ADD_TRANSACTIONS,
  TRANSACTIONS,
  READD_TRANSACTIONS,
  CARDS,
  ITEMS,
  SET_CARDS,
  SET_ITEMS,
  TOGGLE_CARD_SELECTED,
  TOGGLE_ITEM_SELECTED,
  CATEGORIES,
  TOGGLE_CATEGORY_SELECTED,
  RESET_CATEGORIES_SELECTED,
  SET_CATEGORIES_SELECTED,
} from '../konstants'
import { updateIn, set, setIn, update } from 'timm'
import { Transaction as PlaidTransaction, Account as PlaidCard } from 'plaid'
import { DBItem, PileaCard } from '../sagas/sagas'
import { AccountsInterfaces, TransactionsInterfaces } from '../actions'

export interface CardWithFilter extends PileaCard {
  selected: boolean
}
export interface ItemWithFilter extends DBItem {
  selected: boolean
}
export interface Categories {
  [key: string]: boolean
}

export interface TransactionsAccountsState {
  [TRANSACTIONS]: PlaidTransaction[]
  [CARDS]: CardWithFilter[]
  [ITEMS]: ItemWithFilter[]
  [CATEGORIES]: Categories
}

const initialState: TransactionsAccountsState = {
  [TRANSACTIONS]: [],
  [CARDS]: [],
  [ITEMS]: [],
  [CATEGORIES]: {},
}

const transactions: (
  state: TransactionsAccountsState,
  action: AccountsInterfaces | TransactionsInterfaces
) => TransactionsAccountsState = (state = initialState, action) => {
  let newState: TransactionsAccountsState

  switch (action.type) {
    case ADD_TRANSACTIONS: {
      const translatedTxs: PlaidTransaction[] = action.payload.map(tx => ({
        ...tx,
        category: tx.category
          ? typeof tx.category === 'string'
            ? tx.category
                .replace(/[{|}|"]/g, '')
                .trim()
                .split(',')
            : tx.category
          : [],
      }))

      newState = updateIn(state, [TRANSACTIONS], existingTxs => [
        ...existingTxs,
        ...translatedTxs,
      ])

      // Everytime we get new data, we refresh all categories to be selected
      const newCategories = [
        ...translatedTxs.map(tx => tx.category),
        ...Object.keys(state[CATEGORIES]).map(category => [category]),
      ].reduce(
        (acc, catStringArr) => {
          catStringArr.forEach(cat => {
            if (!acc[cat]) {
              acc[cat] = true
            }
          })
          return acc
        },
        {} as Categories
      )

      newState = setIn(newState, [CATEGORIES], newCategories)
      break
    }

    case TOGGLE_CATEGORY_SELECTED: {
      newState = updateIn(state, [CATEGORIES], (oldCategories: Categories) => ({
        ...oldCategories,
        [action.payload]: !oldCategories[action.payload],
      }))

      break
    }

    case RESET_CATEGORIES_SELECTED: {
      newState = updateIn(state, [CATEGORIES], (oldCategories: Categories) =>
        Object.keys(oldCategories).reduce(
          (acc, cur) => {
            acc[cur] = true
            return acc
          },
          {} as Categories
        )
      )

      break
    }

    case SET_CATEGORIES_SELECTED: {
      newState = updateIn(state, [CATEGORIES], (oldCategories: Categories) => {
        const allFalseCategories: Categories = Object.keys(
          oldCategories
        ).reduce(
          (acc, cur) => {
            acc[cur] = false
            return acc
          },
          {} as Categories
        )

        const updatedCategories: Categories = action.payload.reduce(
          (acc, cur) => {
            acc[cur] = true
            return acc
          },
          allFalseCategories
        )

        return updatedCategories
      })
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

    case READD_TRANSACTIONS: {
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
  state: TransactionsAccountsState
) => PlaidTransaction[] = state => state[TRANSACTIONS]

export const cardsSelector: (
  state: TransactionsAccountsState
) => CardWithFilter[] = state => state[CARDS]

export const itemsSelector: (
  state: TransactionsAccountsState
) => ItemWithFilter[] = state => state[ITEMS]

export const categoriesSelector: (
  state: TransactionsAccountsState
) => Categories = state => state[CATEGORIES]
