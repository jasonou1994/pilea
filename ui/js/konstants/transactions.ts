//ACTIONS
export const ADD_TRANSACTIONS = 'ADD_TRANSACTIONS'
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS'
export const READD_TRANSACTIONS = 'RESET_TRANSACTTIONS'
export const START_LOADING_TRANSACTIONS = 'START_LOADING_TRANSACTIONS'
export const STOP_LOADING_TRANSACTIONS = 'STOP_LOADING_TRANSACTIONS'
export const TOGGLE_CATEGORY_SELECTED = 'TOGGLE_CATEGORY_SELECTED'
export const SELECT_ALL_CATEGORIES = 'SELECT_ALL_CATEGORIES'
export const SET_CATEGORIES_SELECTED = 'SET_CATEGORIES_SELECTED'
export const SELECT_SINGLE_CATEGORY = 'SELECT_SINGLE_CATEGORY'

//STORE
export const TRANSACTIONS = 'transactions'
export const IS_LOADING = 'isLoading'

//REDUCER
export const AMOUNT = 'amount'
export const CATEGORIES = 'categories'
export const NAME = 'name'

//ETC
export const INPUT = 'input'
export const OUTPUT = 'output'

// SAGA
export const FETCH_REFRESH_TRANSACTIONS = 'REFRESH_TRANSACTIONS'

// CATEGORY FILTER GRID
export const CATEGORY_GRID_HEADER_INCLUDED = 'Include'
export const CATEGORY_GRID_HEADER_CATEGORY = 'Category'
export const CATEGORY_GRID_HEADER_TX_COUNT = 'Transaction Count'
export const CATEGORY_GRID_HEADER_AMOUNT = 'Amount'

export const CATEGORY_GRID_FIELD_INCLUDED = 'CATEGORY_GRID_FIELD_INCLUDED'
export const CATEGORY_GRID_FIELD_CATEGORY = 'CATEGORY_GRID_FIELD_CATEGORY'
export const CATEGORY_GRID_FIELD_TX_COUNT = 'CATEGORY_GRID_FIELD_TX_COUNT'
export const CATEGORY_GRID_FIELD_AMOUNT = 'CATEGORY_GRID_FIELD_AMOUNT'
