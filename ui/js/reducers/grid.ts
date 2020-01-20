import { setIn } from 'timm'
import { RootState } from '.'
import { GridActions } from '../actions'
import {
  GRID,
  RESET_SELECTED_TRANSACTION_KEY,
  SELECTED_TRANSACTION_KEY,
  SET_SELECTED_TRANSACTION_KEY,
} from '../konstants/index'

export interface GridState {
  [SELECTED_TRANSACTION_KEY]: string
}

const initialState: GridState = {
  [SELECTED_TRANSACTION_KEY]: '',
}

const grid: (state: GridState, action: GridActions) => GridState = (
  state = initialState,
  action
) => {
  let newState

  switch (action.type) {
    case SET_SELECTED_TRANSACTION_KEY: {
      newState = setIn(state, [SELECTED_TRANSACTION_KEY], action.payload)

      break
    }
    case RESET_SELECTED_TRANSACTION_KEY: {
      newState = setIn(state, [SELECTED_TRANSACTION_KEY], '')

      break
    }
    default: {
      newState = state
    }
  }
  return newState
}
export default grid

export const selectedTransactionKeySelector = (state: RootState) =>
  state[GRID][SELECTED_TRANSACTION_KEY]
