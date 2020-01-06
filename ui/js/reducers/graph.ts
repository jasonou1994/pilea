import { setIn } from 'timm'
import {
  GRAPH_FIDELITY,
  SET_GRAPH_FIDELITY,
  HISTORICAL_LENGTH,
  HISTORICAL_TIME_COUNT,
  HISTORICAL_TIME_UNIT,
  AvailableTimeUnits,
  SET_GRAPH_HISTORICAL_LENGTH,
  MONTH,
  GRAPH,
  INCOME_SPENDING,
  HISTORICAL_BALANCES,
  TYPE,
} from '../konstants/index'
import { GraphInterfaces } from '../actions'
import { RootState } from '.'

interface GraphOptions {
  [GRAPH_FIDELITY]: AvailableTimeUnits
  [HISTORICAL_LENGTH]: {
    [HISTORICAL_TIME_COUNT]: number
    [HISTORICAL_TIME_UNIT]: AvailableTimeUnits
  }
}

interface HistoricalGraphOptions extends GraphOptions {
  [TYPE]: 'combined' | 'individual'
}

export interface GraphState {
  [INCOME_SPENDING]: GraphOptions
  [HISTORICAL_BALANCES]: HistoricalGraphOptions
}

const initialState: GraphState = {
  [INCOME_SPENDING]: {
    [GRAPH_FIDELITY]: MONTH,
    [HISTORICAL_LENGTH]: {
      [HISTORICAL_TIME_COUNT]: 1,
      [HISTORICAL_TIME_UNIT]: 'year',
    },
  },
  [HISTORICAL_BALANCES]: {
    [GRAPH_FIDELITY]: MONTH,
    [HISTORICAL_LENGTH]: {
      [HISTORICAL_TIME_COUNT]: 1,
      [HISTORICAL_TIME_UNIT]: 'year',
    },
    [TYPE]: 'combined',
  },
}

const graph: (state: GraphState, action: GraphInterfaces) => GraphState = (
  state = initialState,
  action
) => {
  let newState: GraphState

  switch (action.type) {
    case SET_GRAPH_FIDELITY: {
      newState = setIn(
        state,
        [action.payload.graph, GRAPH_FIDELITY],
        action.payload.fidelity
      )

      break
    }

    case SET_GRAPH_HISTORICAL_LENGTH: {
      const {
        length: { count, unit },
        graph,
      } = action.payload

      newState = setIn(state, [graph, HISTORICAL_LENGTH], {
        [HISTORICAL_TIME_COUNT]: count,
        [HISTORICAL_TIME_UNIT]: unit,
      })

      break
    }

    default: {
      newState = state
    }
  }
  return newState
}
export default graph

export const incomeSpendingGraphFidelitySelector = (state: RootState) =>
  state[GRAPH][INCOME_SPENDING][GRAPH_FIDELITY]

export const incomeSpendingGraphHistoricalLengthSelector = (state: RootState) =>
  state[GRAPH][INCOME_SPENDING][HISTORICAL_LENGTH]

export const historicalGraphFidelitySelector = (state: RootState) =>
  state[GRAPH][HISTORICAL_BALANCES][GRAPH_FIDELITY]

export const historicalGraphHistoricalLengthSelector = (state: RootState) =>
  state[GRAPH][HISTORICAL_BALANCES][HISTORICAL_LENGTH]

export const historicalGraphTypeSelector = (state: RootState) =>
  state[GRAPH][HISTORICAL_BALANCES][TYPE]
