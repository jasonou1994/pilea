import {
  SET_SELECTED_TRANSACTION_KEY,
  RESET_SELECTED_TRANSACTION_KEY,
} from '../konstants/index'
import { Action } from 'redux'

type GridActionTypes =
  | typeof SET_SELECTED_TRANSACTION_KEY
  | typeof RESET_SELECTED_TRANSACTION_KEY

export type GridActions =
  | SetSelectedTransactionAction
  | ResetSelectedTransactionAction

// Generics
interface GridAction<P, AT extends GridActionTypes> extends Action<AT> {
  type: AT
  payload: P
}
type GridActionCreator<P, AT extends GridActionTypes> = (
  payload: P
) => GridAction<P, AT>

// Action Creators
export type SetSelectedTransactionActionCreator = GridActionCreator<
  string,
  typeof SET_SELECTED_TRANSACTION_KEY
>
export type SetSelectedTransactionAction = GridAction<
  string,
  typeof SET_SELECTED_TRANSACTION_KEY
>
export const setSelectedTransactionKey: SetSelectedTransactionActionCreator = key => ({
  type: SET_SELECTED_TRANSACTION_KEY,
  payload: key,
})

export type ResetSelectedTransactionActionCreator = GridActionCreator<
  void,
  typeof RESET_SELECTED_TRANSACTION_KEY
>
export type ResetSelectedTransactionAction = GridAction<
  void,
  typeof RESET_SELECTED_TRANSACTION_KEY
>
export const resetSelectedTransactionKey: ResetSelectedTransactionActionCreator = () => ({
  type: RESET_SELECTED_TRANSACTION_KEY,
  payload: undefined,
})
