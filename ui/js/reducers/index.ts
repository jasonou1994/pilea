import { combineReducers } from 'redux'
import {
  TRANSACTIONS,
  LOGIN,
  GRAPH,
  GRID,
  LOADING,
  NOTIFICATIONS,
  SIZING,
} from '../konstants'
import transactions, { TransactionsAccountsState } from './transactionsAccounts'
import login, { LoginState } from './login'
import graph, { GraphState } from './graph'
import grid, { GridState } from './grid'
import loading, { LoadingState } from './loading'
import notifications, { NotificationsState } from './notifications'
import sizing, { SizingState } from './sizing'

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
