import { Map } from 'immutable'
import {
  SELECTED_TRANSACTION_KEY,
  SET_SELECTED_TRANSACTION_KEY,
} from '../constants/index'
import { GridActionTypes } from '../actions'

const initialState = Map({
  [SELECTED_TRANSACTION_KEY]: '',
})

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
      const { key } = payload

      newState = state.setIn([SELECTED_TRANSACTION_KEY], key)

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
