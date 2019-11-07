//STATE
export const GRID = 'grid'
export const SELECTED_TRANSACTION_KEY = 'selectedTransactionKey'

//ACTION
export const SET_SELECTED_TRANSACTION_KEY = 'SET_SELECTED_TRANSACTION_KEY'
export const RESET_SELECTED_TRANSACTION_KEY = 'RESET_SELECTED_TRANSACTION_KEY'

// grid layouts
export const GRID_LAYOUT_BY_TIME = 'GRID_LAYOUT_BY_TIME'

export type AvailableGridLayouts = typeof GRID_LAYOUT_BY_TIME
