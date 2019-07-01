import { SET_SELECTED_TRANSACTION_KEY } from '../konstants/index'
import { Action } from 'redux'

export type GridActionTypes = typeof SET_SELECTED_TRANSACTION_KEY

// Generics
export interface GridAction<P, AT extends GridActionTypes> extends Action<AT> {
  type: AT
  payload: P
}
export type GridActionCreator<P, AT extends GridActionTypes> = (
  payload: P
) => GridAction<P, AT>

// Action Creators
export type SetSelectedTransactionActionCreator = GridActionCreator<
  string,
  typeof SET_SELECTED_TRANSACTION_KEY
>
export const setSelectedTransactionKey: SetSelectedTransactionActionCreator = key => ({
  type: SET_SELECTED_TRANSACTION_KEY,
  payload: key,
})
