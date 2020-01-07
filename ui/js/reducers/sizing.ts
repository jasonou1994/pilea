import { set } from 'timm'
import { SizingActions } from '../actions'
import {
  WINDOW_WIDTH,
  SET_CURRENT_WINDOW_WIDTH,
  SIZING,
  FILTER_SIDEBAR_WIDTH,
  SET_CURRENT_WINDOW_HEIGHT,
  WINDOW_HEIGHT,
} from '../konstants'
import { RootState } from '.'

export interface SizingState {
  [WINDOW_WIDTH]: number
  [WINDOW_HEIGHT]: number

  [FILTER_SIDEBAR_WIDTH]: number
}

const initialState: SizingState = {
  [WINDOW_WIDTH]: 0,
  [WINDOW_HEIGHT]: 0,

  [FILTER_SIDEBAR_WIDTH]: 250,
}

const sizing = (
  state: SizingState = initialState,
  action: SizingActions
): SizingState => {
  let newState

  switch (action.type) {
    case SET_CURRENT_WINDOW_WIDTH: {
      const { width } = action.payload

      newState = set(state, WINDOW_WIDTH, width)

      break
    }

    case SET_CURRENT_WINDOW_HEIGHT: {
      const { height } = action.payload

      newState = set(state, WINDOW_HEIGHT, height)

      break
    }
    default: {
      newState = state
    }
  }
  return newState
}
export default sizing

export const windowWidthSelector = (state: RootState) =>
  state[SIZING][WINDOW_WIDTH]
export const windowHeightSelector = (state: RootState) =>
  state[SIZING][WINDOW_HEIGHT]
export const filterSidebarWidthSelector = (state: RootState) =>
  state[SIZING][FILTER_SIDEBAR_WIDTH]
