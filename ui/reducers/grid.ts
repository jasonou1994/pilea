import { Map } from 'immutable'
import {
  SELECTED_TRANSACTION_KEY,
  SET_SELECTED_TRANSACTION_KEY,
  RESET_SELECTED_TRANSACTION_KEY,
} from '../konstants/index'
import { setIn } from 'timm'
import { GridActions } from '../actions'

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

export const selectedTransactionKeySelector = (state: typeof initialState) => {
  return state[SELECTED_TRANSACTION_KEY]
}
