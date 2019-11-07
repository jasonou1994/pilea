import {
  FETCH_LOG_IN,
  SET_LOGGED_IN,
  SET_USER_INFO,
  FETCH_LOG_OUT,
  FETCH_CREATE_USER,
  FETCH_SEND_PASSWORD_RESET_EMAIL,
} from '../konstants/index'
import { Action } from 'redux'

type LogInActionTypes =
  | typeof FETCH_LOG_IN
  | typeof SET_LOGGED_IN
  | typeof SET_USER_INFO
  | typeof FETCH_LOG_OUT
  | typeof FETCH_CREATE_USER
  | typeof FETCH_SEND_PASSWORD_RESET_EMAIL

export type LogInActions =
  | FetchLogInAction
  | SetLoggedInUserAction
  | SetUserInfoAction
  | FetchLogOutAction
  | FetchCreateUserAction

// Generics
export interface LogInAction<P, AT extends LogInActionTypes>
  extends Action<AT> {
  type: AT
  payload: P
}
export type LogInActionCreator<P, AT extends LogInActionTypes> = (
  payload: P
) => LogInAction<P, AT>

// Action Creators

export type FetchLogInActionCreator = LogInActionCreator<
  {
    user: string
    password: string
  },
  typeof FETCH_LOG_IN
>
export type FetchLogInAction = LogInAction<
  {
    user: string
    password: string
  },
  typeof FETCH_LOG_IN
>
export const fetchLogIn: FetchLogInActionCreator = ({ user, password }) => ({
  type: FETCH_LOG_IN,
  payload: { user, password },
})

export type FetchLogOutActionCreator = LogInActionCreator<
  {},
  typeof FETCH_LOG_OUT
>
export type FetchLogOutAction = LogInAction<{}, typeof FETCH_LOG_OUT>
export const fetchLogOut: FetchLogOutActionCreator = () => ({
  type: FETCH_LOG_OUT,
  payload: {},
})

export type FetchCreateUserActionCreator = LogInActionCreator<
  {
    user: string
    password: string
  },
  typeof FETCH_CREATE_USER
>
export type FetchCreateUserAction = LogInAction<
  {
    user: string
    password: string
  },
  typeof FETCH_CREATE_USER
>
export const fetchCreateUser: FetchCreateUserActionCreator = ({
  user,
  password,
}) => ({
  type: FETCH_CREATE_USER,
  payload: { user, password },
})

export type SetLoggedInUserActionCreator = LogInActionCreator<
  {
    status: boolean
  },
  typeof SET_LOGGED_IN
>
export type SetLoggedInUserAction = LogInAction<
  {
    status: boolean
  },
  typeof SET_LOGGED_IN
>
export const setLoggedIn: SetLoggedInUserActionCreator = ({ status }) => ({
  type: SET_LOGGED_IN,
  payload: { status },
})

export type SetUserInfoActionCreator = LogInActionCreator<
  {
    userName: string
    userId: number
    confirmed: boolean
  },
  typeof SET_USER_INFO
>
export type SetUserInfoAction = LogInAction<
  {
    userName: string
    userId: number
    confirmed: boolean
  },
  typeof SET_USER_INFO
>
export const setUserInfo: SetUserInfoActionCreator = ({
  userName,
  userId,
  confirmed,
}) => ({
  type: SET_USER_INFO,
  payload: { userName, userId, confirmed },
})

export type FetchSendPasswordResetEmailActionCreator = LogInActionCreator<
  { email: string },
  typeof FETCH_SEND_PASSWORD_RESET_EMAIL
>
export type FetchSendPasswordResetEmailAction = LogInAction<
  { email: string },
  typeof FETCH_SEND_PASSWORD_RESET_EMAIL
>
export const fetchSendPasswordResetEmail: FetchSendPasswordResetEmailActionCreator = ({
  email,
}) => ({
  type: FETCH_SEND_PASSWORD_RESET_EMAIL,
  payload: { email },
})
