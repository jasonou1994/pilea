import { Map } from 'immutable'
import {
  ACCESS_TOKENS,
  USER_ID,
  USER,
  USER_NAME,
  LOGGED_IN,
  SET_LOGGED_IN,
  SET_USER_INFO,
} from '../konstants/index'
import { LogInActionTypes } from '../actions'
import { set } from 'timm'

const initialState = {
  [USER]: Map({
    [USER_ID]: '',
    [USER_NAME]: '',
  }),
  [LOGGED_IN]: false,
}

const login = (
  state: typeof initialState = initialState,
  { type, payload }: { type: LogInActionTypes; payload }
) => {
  let newState

  switch (type) {
    case SET_LOGGED_IN: {
      const { status } = payload

      newState = set(state, LOGGED_IN, status)

      break
    }
    case SET_USER_INFO: {
      const { userName, userId } = payload

      newState = set(
        state,
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
export default login

export const accessTokensSelector = (state: typeof initialState) =>
  state[ACCESS_TOKENS]
export const loggedInSelector = (state: typeof initialState) => state[LOGGED_IN]
export const userSelector = (state: typeof initialState) => state[USER]
