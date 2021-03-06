import { Account as PlaidCard, Transaction as PlaidTransaction } from 'plaid'
import { set, setIn, updateIn } from 'timm'
import { RootState } from '.'
import { AccountsInterfaces, TransactionsInterfaces } from '../actions'
import {
  ADD_CARDS,
  ADD_TRANSACTIONS,
  CARDS,
  CATEGORIES,
  HISTORICAL_BALANCES,
  ITEMS,
  READD_TRANSACTIONS,
  SELECT_ALL_CATEGORIES,
  SELECT_SINGLE_CATEGORY,
  SET_CARDS,
  SET_CATEGORIES_SELECTED,
  SET_HISTORICAL_BALANCES,
  SET_ITEMS,
  SET_TRANSACTIONS,
  SET_TRANSACTIONS_REFRESHED_COUNT,
  TOGGLE_CARD_SELECTED,
  TOGGLE_CATEGORY_SELECTED,
  TOGGLE_ITEM_SELECTED,
  TRANSACTIONS,
  TRANSACTIONS_REFRESHED_COUNT,
} from '../konstants'
import { DBItem, PileaCard } from '../sagas/sagas'
import { parseRawTransaction } from '../utilities/translation'

export interface CardWithFilter extends PileaCard {
  selected: boolean
}

export interface ItemWithFilter extends DBItem {
  selected: boolean
}
export interface Categories {
  [key: string]: boolean
}

export interface DailyBalances {
  [id: string]: number
}

export interface HistoricalBalances {
  [date: string]: DailyBalances
}

export interface TransactionsAccountsState {
  [TRANSACTIONS]: PlaidTransaction[]
  [CARDS]: CardWithFilter[]
  [ITEMS]: ItemWithFilter[]
  [CATEGORIES]: Categories
  [HISTORICAL_BALANCES]: HistoricalBalances
  [TRANSACTIONS_REFRESHED_COUNT]: number
}

const initialState: TransactionsAccountsState = {
  [TRANSACTIONS]: [],
  [CARDS]: [],
  [ITEMS]: [],
  [CATEGORIES]: {},
  [HISTORICAL_BALANCES]: {},
  [TRANSACTIONS_REFRESHED_COUNT]: 0,
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

    case SELECT_ALL_CATEGORIES: {
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

    case SELECT_SINGLE_CATEGORY: {
      newState = updateIn(state, [CATEGORIES], (oldCategories: Categories) => {
        // Initially set all categories to false
        const newCategories: Categories = Object.keys(oldCategories).reduce(
          (acc, cur) => {
            acc[cur] = false
            return acc
          },
          {} as Categories
        )

        newCategories[action.payload.category] = true

        return newCategories
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

    case SET_HISTORICAL_BALANCES: {
      newState = set(state, HISTORICAL_BALANCES, action.payload)
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

    case SET_TRANSACTIONS_REFRESHED_COUNT: {
      newState = set(state, TRANSACTIONS_REFRESHED_COUNT, action.payload)
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

export const cardTypeMapSelector: (
  state: RootState
) => { [cardId: string]: string } = state =>
  state[TRANSACTIONS][CARDS].reduce(
    (acc, { account_id, type }) => ({
      ...acc,
      [account_id]: type,
    }),
    {}
  )

export const itemsSelector: (state: RootState) => ItemWithFilter[] = state =>
  state[TRANSACTIONS][ITEMS]

export const categoriesSelector: (state: RootState) => Categories = state =>
  state[TRANSACTIONS][CATEGORIES]

export const historicalBalancesSelector: (
  state: RootState
) => HistoricalBalances = state => state[TRANSACTIONS][HISTORICAL_BALANCES]

export const transactionsRefreshedCountSelector: (
  state: RootState
) => number = state => state[TRANSACTIONS][TRANSACTIONS_REFRESHED_COUNT]
