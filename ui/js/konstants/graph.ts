import { HISTORICAL_BALANCES } from './accounts'

//STATE
export const GRAPH_FIDELITY = 'graphFidelity'
export const GRAPH = 'graph'
export const HISTORICAL_LENGTH = 'historicalLength'
export const HISTORICAL_TIME_COUNT = 'historicalTimeCount'
export const HISTORICAL_TIME_UNIT = 'historicalTimeUnit'
export const INCOME_SPENDING = 'incomeSpending'
export const TYPE = 'type'

export type AvailableGraphs =
  | typeof HISTORICAL_BALANCES
  | typeof INCOME_SPENDING

//ACTION
export const SET_GRAPH_FIDELITY = 'SET_GRAPH_FIDELITY'
export const SET_GRAPH_HISTORICAL_LENGTH = 'SET_GRAPH_HISTORICAL_LENGTH'
export const SET_HISTORICAL_TYPE = 'SET_HISTORICAL_TYPE'

// time units
export const ONE_YEAR = '1 Year'
export const TWO_YEARS = '2 Years'
export const SIX_MONTHS = '6 Months'
export const THREE_MONTHS = '3 Months'
export const CUSTOM = 'Custom Date Range'

export type AvailableTimeStrings =
  | typeof ONE_YEAR
  | typeof TWO_YEARS
  | typeof SIX_MONTHS
  | typeof THREE_MONTHS

export const DAY = 'day'
export const WEEK = 'week'
export const MONTH = 'month'
export const YEAR = 'year'

export type AvailableTimeUnits =
  | typeof DAY
  | typeof WEEK
  | typeof MONTH
  | typeof YEAR
