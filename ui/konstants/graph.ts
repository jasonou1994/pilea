//STATE
export const GRAPH_FIDELITY = 'graphFidelity'
export const GRAPH = 'graph'
export const HISTORICAL_LENGTH = 'historicalLength'
export const HISTORICAL_TIME_COUNT = 'historicalTimeCount'
export const HISTORICAL_TIME_UNIT = 'historicalTimeUnit'

//ACTION
export const SET_GRAPH_FIDELITY = 'SET_GRAPH_FIDELITY'

//misc
export const ONE_YEAR = '1 Year'
export const TWO_YEARS = '2 Years'
export const SIX_MONTHS = '6 Months'
export const THREE_MONTHS = '3 Months'
export const CUSTOM = 'Custom Date Range'

// time units
export const DAY = 'day'
export const WEEK = 'week'
export const MONTH = 'month'
export const YEAR = 'year'

export type AvailableTimeUnits =
  | typeof DAY
  | typeof WEEK
  | typeof MONTH
  | typeof YEAR
