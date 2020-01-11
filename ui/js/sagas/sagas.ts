import { call, put, takeLatest, all } from 'redux-saga/effects'
import moment from 'moment'
import {
  readdTransactions,
  setLoggedIn,
  setUserInfo,
  setItems,
  FetchCreateUserAction,
  FetchAddItemInterface,
  FetchLogInAction,
  FetchRemoveItemInterface,
  setCards,
  setTransactions,
  FetchSendPasswordResetEmailAction,
  addActiveNotification,
  setHistoricalBalances,
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
  FETCH_GET_HISTORICAL_BALANCES,
  API_ACCOUNTS_GET_DAILY_BALANCES,
} from '../konstants'
import { services } from '../utilities/services'
import {
  Account as PlaidCard,
  Iso8601DateString,
  TransactionLocation,
  TransactionPaymentMeta,
} from 'plaid'
import { startLoading, stopLoading } from '../actions/loading'
import { createNotification } from '../utilities/utils'
import { HistoricalBalances } from '../reducers/transactionsAccounts'

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
  error: string
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

export interface HistoricalBalancesResponse extends APIResponse {
  historicalBalances: HistoricalBalances
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

    yield put(startLoading(TRANSACTIONS))

    const [{ cards, transactions, items }, { historicalBalances }]: [
      TransactionsRetrieveResponse,
      HistoricalBalancesResponse
    ] = yield all([
      call(services[API_ITEMS_ADD], {
        body: JSON.stringify({
          publicToken: accessToken,
          alias,
          start,
          end,
        }),
      }),
      call(services[API_ACCOUNTS_GET_DAILY_BALANCES]),
    ])

    yield put(setCards(cards))
    yield put(setTransactions(transactions))
    yield put(setItems(items))
    yield put(setHistoricalBalances(historicalBalances))

    yield put(stopLoading(TRANSACTIONS))

    yield put(
      addActiveNotification({
        notification: createNotification(
          'Add Account',
          `Account ${alias} successfully added. Data for all accounts refreshed.`,
          true
        ),
      })
    )
  } catch ({ error, status }) {
    console.error(status, error)
    yield put(
      addActiveNotification({
        notification: createNotification(
          'Add Account',
          `Failed to add account ${alias}: ${error}`,
          false
        ),
      })
    )
  }
}

function* removeItem({ payload: itemId }: FetchRemoveItemInterface) {
  try {
    const [{ cards, transactions, items }, { historicalBalances }]: [
      TransactionsRetrieveResponse,
      HistoricalBalancesResponse
    ] = yield all([
      call(services[API_ITEMS_REMOVE], {
        body: JSON.stringify({ itemId }),
      }),
      call(services[API_ACCOUNTS_GET_DAILY_BALANCES]),
    ])

    yield put(setCards(cards))
    yield put(setTransactions(transactions))
    yield put(setItems(items))
    yield put(setHistoricalBalances(historicalBalances))

    yield put(
      addActiveNotification({
        notification: createNotification(
          'Remove Account',
          `Account successfully removed. Data for all accounts refreshed.`,
          true
        ),
      })
    )
  } catch ({ error, status }) {
    console.error(error, status)
    yield put(
      addActiveNotification({
        notification: createNotification(
          'Remove Account',
          `Failed to remove account: ${error}`,
          false
        ),
      })
    )
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

    // 2. Immediately request accounts + tx stored in DB and historical balances
    yield put(startLoading(TRANSACTIONS))

    const [{ cards, transactions, items }, { historicalBalances }]: [
      TransactionsRetrieveResponse,
      HistoricalBalancesResponse
    ] = yield all([
      call(services[API_TRANSACTIONS_RETRIEVE]),
      call(services[API_ACCOUNTS_GET_DAILY_BALANCES]),
    ])

    yield put(setCards(cards))
    yield put(setTransactions(transactions))
    yield put(setItems(items))
    yield put(setHistoricalBalances(historicalBalances))

    yield put(stopLoading(TRANSACTIONS))

    // 3. Notification
    yield put(
      addActiveNotification({
        notification: createNotification(
          'Login Success',
          'You have successfully logged in. Welcome!',
          true
        ),
      })
    )
  } catch ({ error, status }) {
    yield put(stopLoading(LOGIN))
    yield put(stopLoading(TRANSACTIONS))

    yield put(
      addActiveNotification({
        notification: createNotification(
          'An error occurred during log in. Some data may be missing. Please refresh to try again.',
          error,
          false
        ),
      })
    )
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

    yield put(setCards([]))
    yield put(setTransactions([]))
    yield put(setItems([]))

    yield put(
      addActiveNotification({
        notification: createNotification(
          'Log Out',
          `Successfully logged out.`,
          true
        ),
      })
    )
  } catch ({ error, status }) {
    console.log(error, status)
    yield put(
      addActiveNotification({
        notification: createNotification(
          'Failed to Log Out',
          `Please refresh this page to log out properly.`,
          false
        ),
      })
    )
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

    yield put(
      addActiveNotification({
        notification: createNotification(
          'Create Pilea Account',
          `Pilea account ${username} successfully created!`,
          true
        ),
      })
    )
  } catch ({ status, error }) {
    console.error(status, error)
    yield put(
      addActiveNotification({
        notification: createNotification(
          'Create Pilea Account',
          `Failed to create Pilea account: ${error}.`,
          false
        ),
      })
    )
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

    yield put(
      addActiveNotification({
        notification: createNotification(
          'Transactions',
          `Successfully refreshed data for all accounts.`,
          true
        ),
      })
    )
  } catch ({ error, status }) {
    console.error('Error in refreshTransactions:', error, status)
    yield put(
      addActiveNotification({
        notification: createNotification(
          'Transactions',
          `Failed to refresh transactions: ${error}`,
          false
        ),
      })
    )
  }

  yield put(stopLoading(TRANSACTIONS))
}

function* sendPasswordResetEmail({
  payload: { email },
}: FetchSendPasswordResetEmailAction) {
  try {
    yield call(services[API_USER_SEND_PASSWORD_RESET_EMAIL], {
      body: JSON.stringify({ email }),
    })

    yield put(
      addActiveNotification({
        notification: createNotification(
          'Password Reset',
          `If account exists, password reset email will be sent to ${email}`,
          true
        ),
      })
    )
  } catch ({ error, status }) {
    console.error('Error in sendPasswordResetEmail:', error, status)
    yield put(
      addActiveNotification({
        notification: createNotification(
          'Password Reset',
          `Failed to generate password reset email: ${error}`,
          false
        ),
      })
    )
  }
}

function* getHistoricalBalances() {
  try {
    const { historicalBalances }: HistoricalBalancesResponse = yield call(
      services[API_ACCOUNTS_GET_DAILY_BALANCES]
    )

    yield put(setHistoricalBalances(historicalBalances))

    yield put(
      addActiveNotification({
        notification: createNotification(
          'Historical Balances',
          `Successfully retrieved historical balances.`,
          true
        ),
      })
    )
  } catch ({ error, status }) {
    console.error('Error in getHistoricalBalances:', error, status)
    yield put(
      addActiveNotification({
        notification: createNotification(
          'Historical Balances',
          `Failed to retrieve historical balances: ${error}`,
          false
        ),
      })
    )
  }
}

function* saga() {
  yield takeLatest(FETCH_CREATE_USER, fetchCreateUser)
  yield takeLatest(FETCH_REFRESH_TRANSACTIONS, refreshTransactions)
  yield takeLatest(FETCH_ADD_ITEM, addItem)
  yield takeLatest(FETCH_LOG_IN, fetchLogIn)
  yield takeLatest(FETCH_LOG_OUT, fetchLogOut)
  yield takeLatest(FETCH_REMOVE_ITEM, removeItem)
  yield takeLatest(FETCH_SEND_PASSWORD_RESET_EMAIL, sendPasswordResetEmail)
}

export default saga
