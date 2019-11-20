import { call, put, takeLatest } from 'redux-saga/effects'
import moment from 'moment'
// @ts-ignore
import uuid from 'uuid'
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
  FetchSendPasswordResetEmailAction,
  addActiveNotifications,
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
  API_TRANSACTIONS_REFRESH,
  API_ITEMS_REMOVE,
  FETCH_REMOVE_ITEM,
  LOGIN,
  API_USER_SEND_PASSWORD_RESET_EMAIL,
  FETCH_SEND_PASSWORD_RESET_EMAIL,
} from '../konstants'
import { services } from '../utilities/services'
import {
  Account as PlaidCard,
  Transaction as PlaidTransaction,
  Iso8601DateString,
  TransactionLocation,
  TransactionPaymentMeta,
} from 'plaid'
import { startLoading, stopLoading } from '../actions/loading'
import {
  TEMPORARY,
  NotificationDurationType,
} from '../components/common/NotificationsContainer'

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

export interface GetItemsResponse extends AddItemResponse {}

export interface CreateUserResponse extends APIResponse {
  username: string
  userId: number
}

export interface UserLogInResponse extends APIResponse {
  username: string
  userId: number
  confirmed: boolean
}

export interface TransactionsRetrieveResponse extends APIResponse {
  cards: PileaCard[]
  transactions: RawTransaction[]
  items: DBItem[]
}

export interface AddItemResponse extends TransactionsRetrieveResponse {}

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
    const start = moment()
      .subtract(2, 'year')
      .format('YYYY-MM-DD')
    const end = moment().format('YYYY-MM-DD')

    const { cards, transactions, items }: AddItemResponse = yield call(
      services[API_ITEMS_ADD],
      {
        body: JSON.stringify({
          publicToken: accessToken,
          alias,
          start,
          end,
        }),
      }
    )

    yield put(setCards(cards))
    yield put(setTransactions(transactions))
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
    yield put(startLoading(LOGIN))

    const { username, userId, confirmed }: UserLogInResponse = yield call(
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
        userId,
        confirmed,
      })
    )
    yield put(stopLoading(LOGIN))

    // 2. Immediately request accounts + tx stored in DB
    yield put(startLoading(TRANSACTIONS))
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

    yield put(stopLoading(TRANSACTIONS))

    // 3. Notification
    yield put(
      addActiveNotifications({
        notifications: [
          {
            timeCreated: Date.now(),
            durationType: TEMPORARY as NotificationDurationType,
            durationInSeconds: 5,
            id: uuid(),
            success: true,
            title: 'Login Success',
            message: 'You have successfully logged in. Welcome!',
          },
        ],
      })
    )
  } catch (e) {
    yield put(stopLoading(LOGIN))
    yield put(stopLoading(TRANSACTIONS))

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
        confirmed: false,
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
        confirmed: false,
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

    const {
      cards,
      transactions,
      items,
    }: TransactionsRetrieveResponse = yield call(
      services[API_TRANSACTIONS_REFRESH],
      {
        body: JSON.stringify({
          start,
          end,
        }),
      }
    )
    yield put(setCards(cards))
    yield put(setTransactions(transactions))
    yield put(setItems(items))
  } catch (e) {
    console.error('Error in refreshTransactions:', e)
  }

  yield put(stopLoading(TRANSACTIONS))
}

function* sendPasswordResetEmail({
  payload: { email },
}: FetchSendPasswordResetEmailAction) {
  try {
    const { status, success, error }: APIResponse = yield call(
      services[API_USER_SEND_PASSWORD_RESET_EMAIL],
      { body: JSON.stringify({ email }) }
    )

    console.log(status, success, error)
  } catch (e) {
    console.error('Error in sendPasswordResetEmail:', e)
  }
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
  //@ts-ignore
  yield takeLatest(FETCH_SEND_PASSWORD_RESET_EMAIL, sendPasswordResetEmail)
}

export default saga
