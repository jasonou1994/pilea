import {
  API_ITEMS_ADD,
  API_TRANSACTIONS_REFRESH,
  API_TRANSACTIONS_RETRIEVE,
  API_USER_CREATE,
  API_USER_LOGIN,
  API_USER_LOGOUT,
  AvailableAPIs,
} from './constants'

interface ServiceDefinition {
  name: AvailableAPIs
  url: string
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

const serviceDefs: ServiceDefinition[] = [
  {
    name: API_ITEMS_ADD,
    url: 'http://localhost:8000/accounts/add',
  },
  {
    name: API_USER_CREATE,
    url: 'http://localhost:8000/user/create',
  },
  {
    name: API_USER_LOGIN,
    url: 'http://localhost:8000/user/login',
  },
  {
    name: API_TRANSACTIONS_RETRIEVE,
    url: 'http://localhost:8000/transactions/retrieve',
  },
  {
    name: API_USER_LOGOUT,
    url: 'http://localhost:8000/user/logout',
  },
].map(def => ({ ...defaultOptions, ...def } as ServiceDefinition))

export const services = serviceDefs.reduce((acc, service) => {
  const { name, url, ...options } = service

  acc[name] = ({ body }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const rawResponse = await fetch(url, { ...options, body })
        const response = await rawResponse.json()
        const { error, success, status, ...contents } = response

        success ? resolve({ contents, status }) : reject({ status, error })
      } catch (error) {
        reject({ error, status: `Error in ${name}` })
      }
    })
  }

  return acc
}, {})
