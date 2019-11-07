import {
  USER_ID,
  USER,
  USER_NAME,
  LOGGED_IN,
  SET_LOGGED_IN,
  SET_USER_INFO,
  CONFIRMED,
} from '../konstants/index'
import { set } from 'timm'
import { LogInActions } from '../actions'

export interface User {
  [USER_ID]: string
  [USER_NAME]: string
  [CONFIRMED]: boolean
}

export interface LoginState {
  [USER]: User
  [LOGGED_IN]: boolean
}

const initialState: LoginState = {
  [USER]: {
    [USER_ID]: '',
    [USER_NAME]: '',
    [CONFIRMED]: false,
  },
  [LOGGED_IN]: false,
}

const login = (
  state: LoginState = initialState,
  action: LogInActions
): LoginState => {
  let newState

  switch (action.type) {
    case SET_LOGGED_IN: {
      const { status } = action.payload

      newState = set(state, LOGGED_IN, status)

      break
    }
    case SET_USER_INFO: {
      const { userName, userId, confirmed } = action.payload

      newState = set(state, USER, {
        [USER_ID]: userId,
        [USER_NAME]: userName,
        [CONFIRMED]: confirmed,
      })

      break
    }
    default: {
      newState = state
    }
  }
  return newState
}
export default login

export const loggedInSelector = (state: typeof initialState) => state[LOGGED_IN]
export const userSelector = (state: typeof initialState) => state[USER]