import { Map } from 'immutable'
import {
  ACCESS_TOKENS,
  USER_ID,
  USER,
  USER_NAME,
  LOGGED_IN,
  SET_LOGGED_IN,
  SET_USER_INFO,
} from '../constants/index'

const initialState = Map({
  [USER]: Map({
    [USER_ID]: '',
    [USER_NAME]: '',
  }),
  [LOGGED_IN]: false,
})

export default function login(state = initialState, action) {
  const { type, payload } = action
  let newState

  switch (type) {
    case SET_LOGGED_IN: {
      const { status } = payload

      newState = state.set(LOGGED_IN, status)

      break
    }
    case SET_USER_INFO: {
      const { userName, userId } = payload

      newState = state.set(
        USER,
        Map({
          [USER_ID]: userId,
          [USER_NAME]: userName,
        })
      )

      break
    }
    default: {
      newState = state
    }
  }
  return newState
}

export const accessTokensSelector = (state: typeof initialState) =>
  state[ACCESS_TOKENS]
export const loggedInSelector = (state: typeof initialState) => state[LOGGED_IN]
export const userSelector = (state: typeof initialState) => state[USER]
