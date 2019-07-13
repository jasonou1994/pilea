import { setIn } from 'timm'
import {
  GRAPH_FIDELITY,
  SET_GRAPH_FIDELITY,
  HISTORICAL_LENGTH,
  HISTORICAL_TIME_COUNT,
  HISTORICAL_TIME_UNIT,
  AvailableTimeUnits,
} from '../konstants/index'
import { GraphActionTypes } from '../actions'

interface GraphState {
  [GRAPH_FIDELITY]: number
  [HISTORICAL_LENGTH]: {
    [HISTORICAL_TIME_COUNT]: number
    [HISTORICAL_TIME_UNIT]: AvailableTimeUnits
  }
}

const initialState: GraphState = {
  [GRAPH_FIDELITY]: 30,
  [HISTORICAL_LENGTH]: {
    [HISTORICAL_TIME_COUNT]: 1,
    [HISTORICAL_TIME_UNIT]: 'year',
  },
}

const graph: (
  state: typeof initialState,
  {
    payload,
    type,
  }: {
    payload
    type: GraphActionTypes
  }
) => typeof initialState = (state = initialState, { type, payload }) => {
  let newState

  switch (type) {
    case SET_GRAPH_FIDELITY: {
      newState = setIn(state, [GRAPH_FIDELITY], Number(payload))

      break
    }

    default: {
      newState = state
    }
  }
  return newState
}
export default graph

export const graphFidelitySelector = (state: typeof initialState) =>
  state[GRAPH_FIDELITY]
