import { Action } from 'redux'
import {
  ADD_TRANSACTIONS,
  FETCH_REFRESH_TRANSACTIONS,
  FETCH_TRANSACTIONS_COUNT,
  READD_TRANSACTIONS,
  SELECT_ALL_CATEGORIES,
  SELECT_SINGLE_CATEGORY,
  SET_CATEGORIES_SELECTED,
  SET_TRANSACTIONS,
  SET_TRANSACTIONS_REFRESHED_COUNT,
  START_LOADING_TRANSACTIONS,
  STOP_LOADING_TRANSACTIONS,
  TOGGLE_CATEGORY_SELECTED,
} from '../konstants/index'
import { RawTransaction } from '../sagas/sagas'

type TransactionsActionTypes =
  | typeof FETCH_REFRESH_TRANSACTIONS
  | typeof ADD_TRANSACTIONS
  | typeof SET_TRANSACTIONS
  | typeof READD_TRANSACTIONS
  | typeof START_LOADING_TRANSACTIONS
  | typeof STOP_LOADING_TRANSACTIONS
  | typeof TOGGLE_CATEGORY_SELECTED
  | typeof SELECT_ALL_CATEGORIES
  | typeof SET_CATEGORIES_SELECTED
  | typeof SELECT_SINGLE_CATEGORY
  | typeof FETCH_TRANSACTIONS_COUNT
  | typeof SET_TRANSACTIONS_REFRESHED_COUNT

export type TransactionsInterfaces =
  | FetchRefreshTransactionsInterface
  | addTransactionsInterface
  | SetTransactionsInterface
  | ReaddTransactionsInterface
  | ToggleCategorySelectedInterface
  | SelectAllCategoriesInterface
  | SetCategoriesSelectedInterface
  | SelectSingleCategoryInterface
  | SetTransactionsRefreshedCountInterface

// Generics
export interface TransactionsAction<P, AT extends TransactionsActionTypes>
  extends Action<TransactionsActionTypes> {
  payload: P
  type: AT
}
export type TransactionsActionCreator<P, AT extends TransactionsActionTypes> = (
  payload: P
) => TransactionsAction<P, AT>

// Action Creators
export type FetchRefreshTransactionsActionCreator = TransactionsActionCreator<
  {},
  typeof FETCH_REFRESH_TRANSACTIONS
>
export type FetchRefreshTransactionsInterface = TransactionsAction<
  {},
  typeof FETCH_REFRESH_TRANSACTIONS
>
export const fetchRefreshTransactions: FetchRefreshTransactionsActionCreator = () => ({
  type: FETCH_REFRESH_TRANSACTIONS,
  payload: {},
})

export type addTransactionsActionCreator = TransactionsActionCreator<
  RawTransaction[],
  typeof ADD_TRANSACTIONS
>
export type addTransactionsInterface = TransactionsAction<
  RawTransaction[],
  typeof ADD_TRANSACTIONS
>
export const addTransactions: addTransactionsActionCreator = transactions => ({
  type: ADD_TRANSACTIONS,
  payload: transactions,
})

export type setTransactionsActionCreator = TransactionsActionCreator<
  RawTransaction[],
  typeof SET_TRANSACTIONS
>
export type SetTransactionsInterface = TransactionsAction<
  RawTransaction[],
  typeof SET_TRANSACTIONS
>
export const setTransactions: setTransactionsActionCreator = transactions => ({
  type: SET_TRANSACTIONS,
  payload: transactions,
})

export type ReaddTransactionsActionCreator = TransactionsActionCreator<
  {},
  typeof READD_TRANSACTIONS
>
export type ReaddTransactionsInterface = TransactionsAction<
  {},
  typeof READD_TRANSACTIONS
>
export const readdTransactions: ReaddTransactionsActionCreator = () => ({
  type: READD_TRANSACTIONS,
  payload: {},
})

export type ToggleCategorySelectedActionCreator = TransactionsActionCreator<
  { category: string },
  typeof TOGGLE_CATEGORY_SELECTED
>
export type ToggleCategorySelectedInterface = TransactionsAction<
  { category: string },
  typeof TOGGLE_CATEGORY_SELECTED
>
export const toggleCategorySelected: ToggleCategorySelectedActionCreator = category => ({
  type: TOGGLE_CATEGORY_SELECTED,
  payload: category,
})

export type SelectAllCategoriesActionCreator = TransactionsActionCreator<
  {},
  typeof SELECT_ALL_CATEGORIES
>
export type SelectAllCategoriesInterface = TransactionsAction<
  {},
  typeof SELECT_ALL_CATEGORIES
>
export const selectAllCategories: SelectAllCategoriesActionCreator = () => ({
  type: SELECT_ALL_CATEGORIES,
  payload: {},
})

export type SetCategoriesSelectedActionCreator = TransactionsActionCreator<
  string[],
  typeof SET_CATEGORIES_SELECTED
>
export type SetCategoriesSelectedInterface = TransactionsAction<
  string[],
  typeof SET_CATEGORIES_SELECTED
>
export const setCategoriesSelected: SetCategoriesSelectedActionCreator = selectedCategories => ({
  type: SET_CATEGORIES_SELECTED,
  payload: selectedCategories,
})

export type SelectSingleCategoryActionCreator = TransactionsActionCreator<
  { category: string },
  typeof SELECT_SINGLE_CATEGORY
>
export type SelectSingleCategoryInterface = TransactionsAction<
  { category: string },
  typeof SELECT_SINGLE_CATEGORY
>
export const selectSingleCategory: SelectSingleCategoryActionCreator = ({
  category,
}) => ({
  type: SELECT_SINGLE_CATEGORY,
  payload: { category },
})

export type FetchTransactionsCountActionCreator = TransactionsActionCreator<
  void,
  typeof FETCH_TRANSACTIONS_COUNT
>
export type FetchTransactionsCountInterface = TransactionsAction<
  void,
  typeof FETCH_TRANSACTIONS_COUNT
>
export const fetchTransactionsCount: FetchTransactionsCountActionCreator = () => ({
  type: FETCH_TRANSACTIONS_COUNT,
  payload: undefined,
})

export type SetTransactionsRefreshedCountActionCreator = TransactionsActionCreator<
  number,
  typeof SET_TRANSACTIONS_REFRESHED_COUNT
>
export type SetTransactionsRefreshedCountInterface = TransactionsAction<
  number,
  typeof SET_TRANSACTIONS_REFRESHED_COUNT
>
export const setTransactionsRefreshedCount: SetTransactionsRefreshedCountActionCreator = (
  count: number
) => ({
  type: SET_TRANSACTIONS_REFRESHED_COUNT,
  payload: count,
})
