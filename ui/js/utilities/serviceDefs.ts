import {
  API_ITEMS_ADD,
  API_TRANSACTIONS_RETRIEVE,
  API_USER_CREATE,
  API_USER_LOGIN,
  API_USER_LOGOUT,
  AvailableAPIs,
  API_ITEMS_GET,
  API_ITEMS_REMOVE,
  API_TRANSACTIONS_REFRESH,
  API_USER_SEND_PASSWORD_RESET_EMAIL,
} from '../konstants'

interface ServiceDefinition {
  name: AvailableAPIs
  path: string
  method: 'POST' | 'GET'
  headers: any
  credentials: RequestCredentials
}

const defaultOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
}

export const serviceDefs: ServiceDefinition[] = [
  {
    name: API_ITEMS_ADD,
    path: '/items/add',
  },
  {
    name: API_ITEMS_GET,
    path: '/items/',
    method: 'GET',
  },
  {
    name: API_USER_CREATE,
    path: '/user/create',
  },
  {
    name: API_USER_LOGIN,
    path: '/user/login',
  },
  {
    name: API_TRANSACTIONS_REFRESH,
    path: '/transactions/refresh',
  },
  {
    name: API_TRANSACTIONS_RETRIEVE,
    path: '/transactions/retrieve',
  },
  {
    name: API_USER_LOGOUT,
    path: '/user/logout',
  },
  {
    name: API_ITEMS_REMOVE,
    path: '/items/delete',
  },
  {
    name: API_USER_SEND_PASSWORD_RESET_EMAIL,
    path: '/user/password/forgot',
  },
].map(def => ({ ...defaultOptions, ...def } as ServiceDefinition))