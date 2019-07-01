import { TRANSACTIONS } from '../konstants'
import { Action } from 'redux'

export type Loaders = typeof TRANSACTIONS
export type LoadingActionTypes = 'START' | 'STOP'

// Generics
export interface LoadingAction<
  P extends Loaders,
  AT extends LoadingActionTypes
> extends Action<AT> {
  type: AT
  payload: P
}
export type LoadingActionCreator<
  P extends Loaders,
  AT extends LoadingActionTypes
> = (payload: P) => LoadingAction<P, AT>

// Action Creators
export type StartLoadingActionCreator = LoadingActionCreator<Loaders, 'START'>
export const startLoading: StartLoadingActionCreator = loader => ({
  type: 'START',
  payload: loader,
})

export type StopLoadingActionCreator = LoadingActionCreator<Loaders, 'STOP'>
export const stopLoading: StopLoadingActionCreator = loader => ({
  type: 'STOP',
  payload: loader,
})
