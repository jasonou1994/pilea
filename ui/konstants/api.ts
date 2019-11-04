// ITEMS
export const API_ITEMS_ADD = 'API_ITEMS_ADD'
export const API_ITEMS_GET = 'API_ITEMS_GET'
export const API_ITEMS_REMOVE = 'API_ITEMS_REMOVE'

// USERS
export const API_USER_CREATE = 'API_USER_CREATE'
export const API_USER_LOGIN = 'API_USER_LOGIN'
export const API_USER_LOGOUT = 'API_USER_LOGOUT'
export const API_USER_SEND_PASSWORD_RESET_EMAIL =
  'API_USER_SEND_PASSWORD_RESET_EMAIL'

// TX
export const API_TRANSACTIONS_REFRESH = 'API_TRANSACTIONS_REFRESH'
export const API_TRANSACTIONS_RETRIEVE = 'API_TRANSACTIONS_RETRIEVE'

export type AvailableAPIs =
  | typeof API_ITEMS_ADD
  | typeof API_TRANSACTIONS_REFRESH
  | typeof API_TRANSACTIONS_RETRIEVE
  | typeof API_USER_CREATE
  | typeof API_USER_LOGIN
  | typeof API_USER_LOGOUT
  | typeof API_ITEMS_REMOVE
  | typeof API_USER_SEND_PASSWORD_RESET_EMAIL
