import {
  FETCH_REFRESH_TRANSACTIONS,
  SET_TRANSACTIONS,
  RESET_TRANSACTIONS,
  START_LOADING_TRANSACTIONS,
  STOP_LOADING_TRANSACTIONS,
} from '../konstants/index'
import { Action } from 'redux'
import { Transaction } from 'plaid'

export type TransactionsActionTypes =
  | typeof FETCH_REFRESH_TRANSACTIONS
  | typeof SET_TRANSACTIONS
  | typeof RESET_TRANSACTIONS
  | typeof START_LOADING_TRANSACTIONS
  | typeof STOP_LOADING_TRANSACTIONS

// Generics
export interface TransactionsAction<P> extends Action<TransactionsActionTypes> {
  type: TransactionsActionTypes
  payload: P
}
export type TransactionsActionCreator<P> = (payload: P) => TransactionsAction<P>

// Action Creators
export type RefreshTransactionsActionCreator = TransactionsActionCreator<{}>
export const refreshTransactions: RefreshTransactionsActionCreator = () => ({
  type: FETCH_REFRESH_TRANSACTIONS,
  payload: {},
})

export type SetTransactionsActionCreator = TransactionsActionCreator<
  Transaction[]
>
export const setTransactions: SetTransactionsActionCreator = transactions => ({
  type: SET_TRANSACTIONS,
  payload: transactions,
})

export type ResetTransactionsActionCreator = TransactionsActionCreator<{}>
export const resetTransactions: ResetTransactionsActionCreator = () => ({
  type: RESET_TRANSACTIONS,
  payload: {},
})
