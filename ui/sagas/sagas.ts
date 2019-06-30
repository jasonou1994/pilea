import { call, put, takeLatest } from 'redux-saga/effects'
import moment from 'moment'
import {
  setTransactions,
  setAccounts,
  resetTransactions,
  startLoadingTransactions,
  stopLoadingTransactions,
  setLoggedIn,
  setUserInfo,
} from '../actions'
import {
  FETCH_ADD_ACCOUNT,
  TRANSACTIONS,
  FETCH_LOG_IN,
  FETCH_LOG_OUT,
  FETCH_CREATE_USER,
  FETCH_REFRESH_TRANSACTIONS,
  API_ITEMS_ADD,
  ITEMS,
  API_USER_LOGIN,
  API_TRANSACTIONS_RETRIEVE,
  API_USER_LOGOUT,
  API_USER_CREATE,
} from '../constants'
import { parseSSEFields } from '../utils'
import { services } from '../services'
import { Account as PlaidCard, Transaction as PlaidTransaction } from 'plaid'

interface APIResponse {
  success: boolean
  status: string
  error: any
}

interface AddItemResponse extends APIResponse {
  items: Array<{
    id?: number
    userId: number
    accessToken: string
    lastUpdated?: string
    alias?: string
  }>
}

interface CreateUserResponse extends APIResponse {
  username: string
  userId: number
}

interface UserLogInResponse extends APIResponse {
  username: string
  id: number
}

interface TransactionsRetrieveResponse extends APIResponse {
  cards: PlaidCard[]
  transactions: PlaidTransaction[]
  items: Array<{
    id?: number
    userId: number
    accessToken: string
    lastUpdated?: string
    alias?: string
  }>
}

function* addItem({ payload: publicToken }) {
  try {
    const { status, items }: AddItemResponse = yield call(
      services[API_ITEMS_ADD],
      {
        body: JSON.stringify({
          publicToken,
          alias: 'noalias',
        }),
      }
    )
    console.log(status, items)
  } catch ({ error, status }) {
    console.error(status, error)
  }
}

function* fetchLogIn({ payload: { user, password } }) {
  try {
    // 1. Attempt log in
    const { username, id }: UserLogInResponse = yield call(
      services[API_USER_LOGIN],
      {
        body: JSON.stringify({
          username: user,
          password,
        }),
      }
    )

    yield put(setLoggedIn({ status: true }))
    yield put(
      setUserInfo({
        userName: username,
        userId: id,
      })
    )

    // 2. Immediately request accounts + tx stored in DB
    const {
      cards,
      transactions,
      items,
    }: TransactionsRetrieveResponse = yield call(
      services[API_TRANSACTIONS_RETRIEVE]
    )

    yield put(setAccounts(cards))
    yield put(setTransactions(transactions))
  } catch ({ error, status }) {
    console.error(status, error)
  }
}

function* fetchLogOut() {
  try {
    yield call(services[API_USER_LOGOUT])

    yield put(setLoggedIn({ status: false }))
    yield put(
      setUserInfo({
        userName: '',
        userId: '',
      })
    )
  } catch ({ error, status }) {
    console.error(status, error)
  }
}

function* fetchCreateUser({ payload: { user, password } }) {
  try {
    const { userId, username }: CreateUserResponse = yield call(
      services[API_USER_CREATE],
      {
        body: JSON.stringify({
          username: user,
          password,
        }),
      }
    )

    yield put(setLoggedIn({ status: true }))
    yield put(
      setUserInfo({
        userName: username,
        userId,
      })
    )
  } catch ({ status, error }) {
    console.error(status, error)
  }
}

function* refreshTransactions() {
  yield put(startLoadingTransactions())
  yield put(resetTransactions())
  try {
    const start = moment()
      .subtract(2, 'year')
      .format('YYYY-MM-DD')
    const end = moment().format('YYYY-MM-DD')

    const SSEResponse = yield call(fetch, ({
      url: 'http://localhost:8000/transactions/retrieve',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        start,
        end,
      }),
    } as unknown) as RequestInfo)

    const reader = yield SSEResponse.body.getReader()
    const decoder = yield new TextDecoder('utf-8')

    let complete = false
    let dataString = ''

    while (!complete) {
      const chunk = yield reader.read()
      dataString += yield decoder.decode(chunk.value)

      const possibleEventArr = dataString.split(/\n\n/g)
      let eventsFound = 0

      // @ts-ignore
      for (const [i, message] of possibleEventArr.entries()) {
        if (i === possibleEventArr.length - 1) {
          continue
        }

        eventsFound++
        const { id, data, event } = parseSSEFields(message)

        if (id === 'CLOSE') {
          complete = true
        }

        switch (event) {
          case ITEMS: {
            yield put(setAccounts(JSON.parse(data)))
            break
          }
          case TRANSACTIONS: {
            yield put(setTransactions(JSON.parse(data)))
            break
          }
          default:
            break
        }
      }
      possibleEventArr.splice(0, eventsFound)
      dataString = possibleEventArr.join('\n\n')
    }
  } catch (e) {
    console.error('Error in fetchTransactions:', e)
  }

  yield put(stopLoadingTransactions())
}

function* saga() {
  //@ts-ignore
  yield takeLatest(FETCH_CREATE_USER, fetchCreateUser)
  //@ts-ignore
  yield takeLatest(FETCH_REFRESH_TRANSACTIONS, refreshTransactions)
  //@ts-ignore
  yield takeLatest(FETCH_ADD_ACCOUNT, addItem)
  //@ts-ignore
  yield takeLatest(FETCH_LOG_IN, fetchLogIn)
  //@ts-ignore
  yield takeLatest(FETCH_LOG_OUT, fetchLogOut)
}

export default saga
