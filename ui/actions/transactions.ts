import {
  FETCH_REFRESH_TRANSACTIONS,
  ADD_TRANSACTIONS,
  READD_TRANSACTIONS,
  START_LOADING_TRANSACTIONS,
  STOP_LOADING_TRANSACTIONS,
  TOGGLE_CATEGORY_SELECTED,
  RESET_CATEGORIES_SELECTED,
  SET_CATEGORIES_SELECTED,
} from '../konstants/index'
import { Action } from 'redux'
import { RawTransaction } from '../sagas/sagas'

type TransactionsActionTypes =
  | typeof FETCH_REFRESH_TRANSACTIONS
  | typeof ADD_TRANSACTIONS
  | typeof READD_TRANSACTIONS
  | typeof START_LOADING_TRANSACTIONS
  | typeof STOP_LOADING_TRANSACTIONS
  | typeof TOGGLE_CATEGORY_SELECTED
  | typeof RESET_CATEGORIES_SELECTED
  | typeof SET_CATEGORIES_SELECTED

export type TransactionsInterfaces =
  | FetchRefreshTransactionsInterface
  | addTransactionsInterface
  | ReaddTransactionsInterface
  | ToggleCategorySelectedInterface
  | ResetCategoriesSelectedInterface
  | SetCategoriesSelectedInterface

// Generics
export interface TransactionsAction<P, AT extends TransactionsActionTypes>
  extends Action<TransactionsActionTypes> {
  type: AT
  payload: P
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
  string,
  typeof TOGGLE_CATEGORY_SELECTED
>
export type ToggleCategorySelectedInterface = TransactionsAction<
  string,
  typeof TOGGLE_CATEGORY_SELECTED
>
export const toggleCategorySelected: ToggleCategorySelectedActionCreator = category => ({
  type: TOGGLE_CATEGORY_SELECTED,
  payload: category,
})

export type ResetCategoriesSelectedActionCreator = TransactionsActionCreator<
  {},
  typeof RESET_CATEGORIES_SELECTED
>
export type ResetCategoriesSelectedInterface = TransactionsAction<
  {},
  typeof RESET_CATEGORIES_SELECTED
>
export const resetCategoriesSelected: ResetCategoriesSelectedActionCreator = () => ({
  type: RESET_CATEGORIES_SELECTED,
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
