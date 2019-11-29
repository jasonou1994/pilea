import { Loaders, LoadingActions } from '../actions/loading'
import { set } from 'timm'
import { LOGIN, TRANSACTIONS, START, STOP, LOADING } from '../konstants'
import { RootState } from '.'

export type LoadingState = {
  [key in Loaders]: boolean
}

const initialState: LoadingState = {
  [LOGIN]: false,
  [TRANSACTIONS]: false,
}

const loading = (
  state: LoadingState = initialState,
  action: LoadingActions
) => {
  let newState

  switch (action.type) {
    case START: {
      newState = set(state, action.payload, true)

      break
    }

    case STOP: {
      newState = set(state, action.payload, false)

      break
    }
    default: {
      newState = state
    }
  }

  return newState
}

export default loading

export const isLoginLoadingSelector = (state: RootState): boolean =>
  state[LOADING][LOGIN]
export const isTransactionsLoadingSelector = (state: RootState): boolean =>
  state[LOADING][TRANSACTIONS]
export const isAnythingLoadingSelector = (state: RootState): boolean =>
  Object.values(state[LOADING]).reduce((acc, cur) => cur || acc, false)
