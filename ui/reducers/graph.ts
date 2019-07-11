import { setIn } from 'timm'
import moment from 'moment'
import {
  GRAPH_FIDELITY,
  SET_GRAPH_FIDELITY,
  START_DATE,
  END_DATE,
  SET_START_DATE,
  SET_END_DATE,
} from '../konstants/index'
import { GraphActionTypes } from '../actions'

const initialState = {
  [GRAPH_FIDELITY]: 30,
  [START_DATE]: moment()
    .subtract(1, 'year')
    .format('YYYY-MM-DD'),
  [END_DATE]: moment().format('YYYY-MM-DD'),
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

    case SET_START_DATE: {
      newState = setIn(state, [START_DATE], payload)

      break
    }
    case SET_END_DATE: {
      newState = setIn(state, [END_DATE], payload)

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
