import {
  FETCH_REFRESH_TRANSACTIONS,
  ADD_TRANSACTIONS,
  READD_TRANSACTIONS,
  START_LOADING_TRANSACTIONS,
  STOP_LOADING_TRANSACTIONS,
  TOGGLE_CATEGORY_SELECTED,
  SELECT_ALL_CATEGORIES,
  SET_CATEGORIES_SELECTED,
  SET_TRANSACTIONS,
  SELECT_SINGLE_CATEGORY,
  FETCH_TRANSACTIONS_COUNT,
} from '../konstants/index'
import { Action } from 'redux'
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

export type TransactionsInterfaces =
  | FetchRefreshTransactionsInterface
  | addTransactionsInterface
  | SetTransactionsInterface
  | ReaddTransactionsInterface
  | ToggleCategorySelectedInterface
  | SelectAllCategoriesInterface
  | SetCategoriesSelectedInterface
  | SelectSingleCategoryInterface

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
