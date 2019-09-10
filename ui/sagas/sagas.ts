import { call, put, takeLatest } from 'redux-saga/effects'
import moment from 'moment'
import {
  addTransactions,
  readdTransactions,
  setLoggedIn,
  setUserInfo,
  addCards,
  setItems,
  FetchCreateUserAction,
  FetchAddItemInterface,
  FetchLogInAction,
  FetchRemoveItemInterface,
  setCards,
  setTransactions,
} from '../actions'
import {
  TRANSACTIONS,
  FETCH_LOG_IN,
  FETCH_LOG_OUT,
  FETCH_CREATE_USER,
  FETCH_REFRESH_TRANSACTIONS,
  API_ITEMS_ADD,
  API_USER_LOGIN,
  API_TRANSACTIONS_RETRIEVE,
  API_USER_LOGOUT,
  API_USER_CREATE,
  FETCH_ADD_ITEM,
  CARDS,
  API_ITEMS_GET,
  API_ITEMS_REMOVE,
  FETCH_REMOVE_ITEM,
} from '../konstants'
import { parseSSEFields } from '../utilities/utils'
import { services } from '../utilities/services'
import {
  Account as PlaidCard,
  Transaction as PlaidTransaction,
  Iso8601DateString,
  TransactionLocation,
  TransactionPaymentMeta,
} from 'plaid'
import { startLoading, stopLoading } from '../actions/loading'

export interface DBItem {
  id: number
  userId: number
  accessToken: string
  lastUpdated?: string
  alias?: string
}

export interface PileaCard extends PlaidCard {
  userId: number
  itemId: number
}
export interface APIResponse {
  success: boolean
  status: string
  error: any
}

export interface AddItemResponse extends APIResponse {
  items: DBItem[]
}

export interface GetItemsResponse extends AddItemResponse {}

export interface CreateUserResponse extends APIResponse {
  username: string
  userId: number
}

export interface UserLogInResponse extends APIResponse {
  username: string
  id: number
}

export interface TransactionsRetrieveResponse extends APIResponse {
  cards: PileaCard[]
  transactions: RawTransaction[]
  items: DBItem[]
}

export interface RemoveItemsResponse extends TransactionsRetrieveResponse {}

export interface RawTransaction {
  account_id: string
  account_owner: string | null
  amount: number | null
  iso_currency_code: string | null
  official_currency_code: string | null
  category: string
  category_id: string | null
  date: Iso8601DateString
  location: TransactionLocation
  name: string | null
  payment_meta: TransactionPaymentMeta
  pending: boolean | null
  pending_transaction_id: string | null
  transaction_id: string
  transaction_type: string | null
}

function* addItem({ payload: { accessToken, alias } }: FetchAddItemInterface) {
  try {
    const { status, items }: AddItemResponse = yield call(
      services[API_ITEMS_ADD],
      {
        body: JSON.stringify({
          publicToken: accessToken,
          alias,
        }),
      }
    )

    yield put(setItems(items))
  } catch ({ error, status }) {
    console.error(status, error)
  }
}

function* removeItem({ payload: itemId }: FetchRemoveItemInterface) {
  try {
    const { cards, transactions, items }: RemoveItemsResponse = yield call(
      services[API_ITEMS_REMOVE],
      {
        body: JSON.stringify({ itemId }),
      }
    )

    yield put(setCards(cards))
    yield put(setTransactions(transactions))
    yield put(setItems(items))
  } catch (error) {
    console.error(error)
  }
}

function* fetchLogIn({ payload: { user, password } }: FetchLogInAction) {
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

    yield put(setCards(cards))
    yield put(setTransactions(transactions))
    yield put(setItems(items))
  } catch (e) {
    console.error(e)
  }
}

function* fetchLogOut() {
  try {
    yield call(services[API_USER_LOGOUT])

    yield put(setLoggedIn({ status: false }))
    yield put(
      setUserInfo({
        userName: '',
        userId: 0,
      })
    )
  } catch (e) {
    console.error(e)
  }
}

function* fetchCreateUser({
  payload: { user, password },
}: FetchCreateUserAction) {
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
  yield put(startLoading(TRANSACTIONS))
  yield put(readdTransactions({}))
  try {
    const start = moment()
      .subtract(2, 'year')
      .format('YYYY-MM-DD')
    const end = moment().format('YYYY-MM-DD')

    const SSEResponse = yield call(
      fetch,
      'http://localhost:8000/transactions/refresh',
      ({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          start,
          end,
        }),
      } as unknown) as RequestInit
    )

    const reader = yield SSEResponse.body.getReader()
    const decoder = yield new TextDecoder('utf-8')

    let complete = false
    let dataString = ''

    while (!complete) {
      const chunk = yield reader.read()
      dataString += yield decoder.decode(chunk.value)

      const possibleEventArr = dataString.split(/\n\n/g)

      let eventsFound = 0

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
          case CARDS: {
            yield put(addCards(JSON.parse(data) as PileaCard[]))
            break
          }
          case TRANSACTIONS: {
            yield put(addTransactions(JSON.parse(data) as RawTransaction[]))
            break
          }
          default:
            break
        }
      }
      possibleEventArr.splice(0, eventsFound)
      dataString = possibleEventArr.join('\n\n')
    }

    // Immediately after successful refresh, get items.
    //@ts-ignore
    const { items }: AddItemResponse = yield call(services[API_ITEMS_GET])

    yield put(setItems(items))
  } catch (e) {
    console.error('Error in fetchTransactions:', e)
  }

  yield put(stopLoading(TRANSACTIONS))
}

function* saga() {
  //@ts-ignore
  yield takeLatest(FETCH_CREATE_USER, fetchCreateUser)
  //@ts-ignore
  yield takeLatest(FETCH_REFRESH_TRANSACTIONS, refreshTransactions)
  //@ts-ignore
  yield takeLatest(FETCH_ADD_ITEM, addItem)
  //@ts-ignore
  yield takeLatest(FETCH_LOG_IN, fetchLogIn)
  //@ts-ignore
  yield takeLatest(FETCH_LOG_OUT, fetchLogOut)
  //@ts-ignore
  yield takeLatest(FETCH_REMOVE_ITEM, removeItem)
}

export default saga
