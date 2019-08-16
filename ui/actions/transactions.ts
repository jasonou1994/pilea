import {
  FETCH_REFRESH_TRANSACTIONS,
  ADD_TRANSACTIONS,
  READD_TRANSACTIONS,
  START_LOADING_TRANSACTIONS,
  STOP_LOADING_TRANSACTIONS,
  TOGGLE_CATEGORY_SELECTED,
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

export type TransactionsInterfaces =
  | FetchRefreshTransactionsInterface
  | SetTransactionsInterface
  | ResetTransactionsInterface
  | ToggleCategorySelectedInterface

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

export type SetTransactionsActionCreator = TransactionsActionCreator<
  RawTransaction[],
  typeof ADD_TRANSACTIONS
>
export type SetTransactionsInterface = TransactionsAction<
  RawTransaction[],
  typeof ADD_TRANSACTIONS
>
export const setTransactions: SetTransactionsActionCreator = transactions => ({
  type: ADD_TRANSACTIONS,
  payload: transactions,
})

export type ResetTransactionsActionCreator = TransactionsActionCreator<
  {},
  typeof READD_TRANSACTIONS
>
export type ResetTransactionsInterface = TransactionsAction<
  {},
  typeof READD_TRANSACTIONS
>
export const resetTransactions: ResetTransactionsActionCreator = () => ({
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
