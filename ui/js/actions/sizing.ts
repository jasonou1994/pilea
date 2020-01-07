import {
  SET_CURRENT_WINDOW_WIDTH,
  SET_CURRENT_WINDOW_HEIGHT,
} from '../konstants'
import { Action } from 'redux'

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
  type: typeof SET_CURRENT_WINDOW_WIDTH
  payload: { width: number }
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
  type: typeof SET_CURRENT_WINDOW_HEIGHT
  payload: { height: number }
}
export const setCurrentWindowHeight: SetCurrentWindowHeightActionCreator = ({
  height,
}) => ({ type: SET_CURRENT_WINDOW_HEIGHT, payload: { height } })
