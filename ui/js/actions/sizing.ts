import { SET_CURRENT_WINDOW_WIDTH } from '../konstants'
import { Action } from 'redux'

export type SizingActions = SetCurrentWindowWidthAction

// Skipping Generics for this one
export type SetCurrentWindowWidthActionCreator = ({
  width,
}: {
  width: number
}) => SetCurrentWindowWidthAction
export interface SetCurrentWindowWidthAction
  extends Action<typeof SET_CURRENT_WINDOW_WIDTH> {
  type: typeof SET_CURRENT_WINDOW_WIDTH
  payload: { width: number }
}
export const setCurrentWindowWidth: SetCurrentWindowWidthActionCreator = ({
  width,
}) => ({ type: SET_CURRENT_WINDOW_WIDTH, payload: { width } })
