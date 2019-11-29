import {
  ADD_TRANSACTIONS,
  TRANSACTIONS,
  READD_TRANSACTIONS,
  CARDS,
  ITEMS,
  ADD_CARDS,
  SET_ITEMS,
  TOGGLE_CARD_SELECTED,
  TOGGLE_ITEM_SELECTED,
  CATEGORIES,
  TOGGLE_CATEGORY_SELECTED,
  RESET_CATEGORIES_SELECTED,
  SET_CATEGORIES_SELECTED,
  SET_CARDS,
  SET_TRANSACTIONS,
} from '../konstants'
import { updateIn, set, setIn } from 'timm'
import { Transaction as PlaidTransaction, Account as PlaidCard } from 'plaid'
import { DBItem, PileaCard } from '../sagas/sagas'
import { AccountsInterfaces, TransactionsInterfaces } from '../actions'
import { parseRawTransaction } from '../utilities/translation'
import { RootState } from '.'

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
      const translatedTxs: PlaidTransaction[] = parseRawTransaction(
        action.payload
      )

      newState = updateIn(state, [TRANSACTIONS], existingTxs => [
        ...existingTxs,
        ...translatedTxs,
      ])

      // Everytime we get new data, we refresh all categories to be selected
      const newCategories = [
        ...translatedTxs.map(tx => tx.category),
        ...Object.keys(state[CATEGORIES]).map(category => [category]),
      ].reduce((acc, catStringArr) => {
        catStringArr.forEach(cat => {
          if (!acc[cat]) {
            acc[cat] = true
          }
        })
        return acc
      }, {} as Categories)

      newState = setIn(newState, [CATEGORIES], newCategories)
      break
    }

    case SET_TRANSACTIONS: {
      const translatedTxs: PlaidTransaction[] = parseRawTransaction(
        action.payload
      )

      newState = setIn(state, [TRANSACTIONS], translatedTxs)

      // Everytime we get new data, we refresh all categories to be selected
      const newCategories = translatedTxs
        .map(tx => tx.category)
        .reduce((acc, catStringArr) => {
          catStringArr.forEach(cat => {
            if (!acc[cat]) {
              acc[cat] = true
            }
          })
          return acc
        }, {} as Categories)

      newState = setIn(newState, [CATEGORIES], newCategories)
      break
    }

    case TOGGLE_CATEGORY_SELECTED: {
      newState = updateIn(state, [CATEGORIES], (oldCategories: Categories) => ({
        ...oldCategories,
        [action.payload.category]: !oldCategories[action.payload.category],
      }))

      break
    }

    case RESET_CATEGORIES_SELECTED: {
      newState = updateIn(state, [CATEGORIES], (oldCategories: Categories) =>
        Object.keys(oldCategories).reduce((acc, cur) => {
          acc[cur] = true
          return acc
        }, {} as Categories)
      )

      break
    }

    case SET_CATEGORIES_SELECTED: {
      newState = updateIn(state, [CATEGORIES], (oldCategories: Categories) => {
        const allFalseCategories: Categories = Object.keys(
          oldCategories
        ).reduce((acc, cur) => {
          acc[cur] = false
          return acc
        }, {} as Categories)

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

    case ADD_CARDS: {
      newState = updateIn(state, [CARDS], existingCards =>
        action.payload.reduce(
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
      )
      break
    }

    case SET_CARDS: {
      newState = setIn(
        state,
        [CARDS],
        action.payload.reduce((acc, newCard) => {
          if (
            !acc.find(existCard => existCard.account_id === newCard.account_id)
          ) {
            acc.push({ ...newCard, selected: true } as CardWithFilter)
          }
          return acc
        }, [] as PlaidCard[])
      )
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
  state: RootState
) => PlaidTransaction[] = state => state[TRANSACTIONS][TRANSACTIONS]

export const cardsSelector: (state: RootState) => CardWithFilter[] = state =>
  state[TRANSACTIONS][CARDS]

export const itemsSelector: (state: RootState) => ItemWithFilter[] = state =>
  state[TRANSACTIONS][ITEMS]

export const categoriesSelector: (state: RootState) => Categories = state =>
  state[TRANSACTIONS][CATEGORIES]
