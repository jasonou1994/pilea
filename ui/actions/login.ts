import {
  FETCH_LOG_IN,
  SET_LOGGED_IN,
  SET_USER_INFO,
  FETCH_LOG_OUT,
  FETCH_CREATE_USER,
} from '../konstants/index'
import { Action } from 'redux'

export type LogInActionTypes =
  | typeof FETCH_LOG_IN
  | typeof SET_LOGGED_IN
  | typeof SET_USER_INFO
  | typeof FETCH_LOG_OUT
  | typeof FETCH_CREATE_USER

// Generics
export interface LogInAction<P> extends Action<LogInActionTypes> {
  type: LogInActionTypes
  payload: P
}
export type LogInActionCreator<P> = (payload: P) => LogInAction<P>

// Action Creators

export type FetchLogInActionCreator = LogInActionCreator<{
  user: string
  password: string
}>
export const fetchLogIn: FetchLogInActionCreator = ({ user, password }) => ({
  type: FETCH_LOG_IN,
  payload: { user, password },
})

export type FetchLogOutActionCreator = LogInActionCreator<{}>
export const fetchLogOut: FetchLogOutActionCreator = () => ({
  type: FETCH_LOG_OUT,
  payload: {},
})

export type FetchCreateUserActionCreator = LogInActionCreator<{
  user: string
  password: string
}>
export const fetchCreateUser: FetchCreateUserActionCreator = ({
  user,
  password,
}) => ({
  type: FETCH_CREATE_USER,
  payload: { user, password },
})

export type SetLoggedInUserActionCreator = LogInActionCreator<{
  status: boolean
}>
export const setLoggedIn: SetLoggedInUserActionCreator = ({ status }) => ({
  type: SET_LOGGED_IN,
  payload: { status },
})

export type SetUserInfoActionCreator = LogInActionCreator<{
  userName: string
  userId: number
}>
export const setUserInfo: SetUserInfoActionCreator = ({
  userName,
  userId,
}) => ({
  type: SET_USER_INFO,
  payload: { userName, userId },
})
