import { Action } from 'redux'
import { LOGIN, TRANSACTIONS, TRANSACTIONS_REFRESHING } from '../konstants'

export type Loaders =
  | typeof TRANSACTIONS
  | typeof LOGIN
  | typeof TRANSACTIONS_REFRESHING
export type LoadingActionTypes = 'START' | 'STOP'
export type LoadingActions = StartLoadingAction | StopLoadingAction

// Generics
export interface LoadingAction<
  P extends Loaders,
  AT extends LoadingActionTypes
> extends Action<AT> {
  payload: P
  type: AT
}
export type LoadingActionCreator<
  P extends Loaders,
  AT extends LoadingActionTypes
> = (payload: P) => LoadingAction<P, AT>

// Action Creators
export type StartLoadingActionCreator = LoadingActionCreator<Loaders, 'START'>
export type StartLoadingAction = LoadingAction<Loaders, 'START'>
export const startLoading: StartLoadingActionCreator = loader => ({
  type: 'START',
  payload: loader,
})

export type StopLoadingActionCreator = LoadingActionCreator<Loaders, 'STOP'>
export type StopLoadingAction = LoadingAction<Loaders, 'STOP'>
export const stopLoading: StopLoadingActionCreator = loader => ({
  type: 'STOP',
  payload: loader,
})
