import { Action } from 'redux'
import {
  SET_CURRENT_WINDOW_HEIGHT,
  SET_CURRENT_WINDOW_WIDTH,
} from '../konstants'

export type SizingActions =
  | SetCurrentWindowWidthAction
  | SetCurrentWindowHeightAction

// Skipping Generics for this one
export type SetCurrentWindowWidthActionCreator = ({
  width,
}: {
  width: number
}) => SetCurrentWindowWidthAction
export interface SetCurrentWindowWidthAction
  extends Action<typeof SET_CURRENT_WINDOW_WIDTH> {
  payload: { width: number }
  type: typeof SET_CURRENT_WINDOW_WIDTH
}
export const setCurrentWindowWidth: SetCurrentWindowWidthActionCreator = ({
  width,
}) => ({ type: SET_CURRENT_WINDOW_WIDTH, payload: { width } })

export type SetCurrentWindowHeightActionCreator = ({
  height,
}: {
  height: number
}) => SetCurrentWindowHeightAction
export interface SetCurrentWindowHeightAction
  extends Action<typeof SET_CURRENT_WINDOW_HEIGHT> {
  payload: { height: number }
  type: typeof SET_CURRENT_WINDOW_HEIGHT
}
export const setCurrentWindowHeight: SetCurrentWindowHeightActionCreator = ({
  height,
}) => ({ type: SET_CURRENT_WINDOW_HEIGHT, payload: { height } })
