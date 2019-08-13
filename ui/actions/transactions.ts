import {
  FETCH_REFRESH_TRANSACTIONS,
  SET_TRANSACTIONS,
  RESET_TRANSACTIONS,
  START_LOADING_TRANSACTIONS,
  STOP_LOADING_TRANSACTIONS,
} from '../konstants/index'
import { Action } from 'redux'
import { Transaction } from 'plaid'

type TransactionsActionTypes =
  | typeof FETCH_REFRESH_TRANSACTIONS
  | typeof SET_TRANSACTIONS
  | typeof RESET_TRANSACTIONS
  | typeof START_LOADING_TRANSACTIONS
  | typeof STOP_LOADING_TRANSACTIONS

export type TransactionsInterfaces =
  | FetchRefreshTransactionsInterface
  | SetTransactionsInterface
  | ResetTransactionsInterface

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
  Transaction[],
  typeof SET_TRANSACTIONS
>
export type SetTransactionsInterface = TransactionsAction<
  Transaction[],
  typeof SET_TRANSACTIONS
>
export const setTransactions: SetTransactionsActionCreator = transactions => ({
  type: SET_TRANSACTIONS,
  payload: transactions,
})

export type ResetTransactionsActionCreator = TransactionsActionCreator<
  {},
  typeof RESET_TRANSACTIONS
>
export type ResetTransactionsInterface = TransactionsAction<
  {},
  typeof RESET_TRANSACTIONS
>
export const resetTransactions: ResetTransactionsActionCreator = () => ({
  type: RESET_TRANSACTIONS,
  payload: {},
})
