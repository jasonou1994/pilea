import { combineReducers } from 'redux'
import {
  GRAPH,
  GRID,
  LOADING,
  LOGIN,
  NOTIFICATIONS,
  SIZING,
  TRANSACTIONS,
} from '../konstants'
import graph, { GraphState } from './graph'
import grid, { GridState } from './grid'
import loading, { LoadingState } from './loading'
import login, { LoginState } from './login'
import notifications, { NotificationsState } from './notifications'
import sizing, { SizingState } from './sizing'
import transactions, { TransactionsAccountsState } from './transactionsAccounts'

export * from './selectors'

export interface RootState {
  [TRANSACTIONS]: TransactionsAccountsState
  [LOGIN]: LoginState
  [GRAPH]: GraphState
  [GRID]: GridState
  [LOADING]: LoadingState
  [NOTIFICATIONS]: NotificationsState
  [SIZING]: SizingState
}

const reducers = combineReducers({
  transactions,
  login,
  graph,
  grid,
  loading,
  notifications,
  sizing,
})
export default reducers
