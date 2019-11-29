import { set } from 'timm'
import { SizingActions } from '../actions'
import { WINDOW_WIDTH, SET_CURRENT_WINDOW_WIDTH } from '../konstants'
import { RootState } from '.'

export interface SizingState {
  [WINDOW_WIDTH]: number
}

const initialState: SizingState = {
  [WINDOW_WIDTH]: 0,
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
    default: {
      newState = state
    }
  }
  return newState
}
export default sizing

export const windowWidthSelector = (state: SizingState) => state[WINDOW_WIDTH]
