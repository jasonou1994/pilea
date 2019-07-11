import { Map } from 'immutable'
import {
  SELECTED_TRANSACTION_KEY,
  SET_SELECTED_TRANSACTION_KEY,
} from '../konstants/index'
import { GridActionTypes } from '../actions'
import { setIn } from 'timm'

const initialState = {
  [SELECTED_TRANSACTION_KEY]: '',
}

const grid: (
  state: typeof initialState,
  {
    type,
    payload,
  }: {
    type: GridActionTypes
    payload: any
  }
) => typeof initialState = (state = initialState, { type, payload }) => {
  let newState

  switch (type) {
    case SET_SELECTED_TRANSACTION_KEY: {
      newState = setIn(state, [SELECTED_TRANSACTION_KEY], payload)

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
