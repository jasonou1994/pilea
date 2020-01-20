import { Action } from 'redux'
import {
  AvailableGraphs,
  AvailableTimeUnits,
  SET_GRAPH_FIDELITY,
  SET_GRAPH_HISTORICAL_LENGTH,
  SET_HISTORICAL_TYPE,
} from '../konstants/index'
import { AvailableHistoricalGraphTypes } from '../reducers/graph'

type GraphActionTypes =
  | typeof SET_GRAPH_FIDELITY
  | typeof SET_GRAPH_HISTORICAL_LENGTH
  | typeof SET_HISTORICAL_TYPE

export type GraphInterfaces =
  | SetGraphFidelityInterface
  | SetGraphHistoricalLengthInterface
  | SetHistoricalTypeInterface

// Generics
export interface GraphAction<P, AT extends GraphActionTypes>
  extends Action<AT> {
  payload: P
  type: AT
}
export type GraphActionCreator<P, AT extends GraphActionTypes> = (
  payload: P
) => GraphAction<P, AT>

// Action Creators
export type SetGraphFidelityActionCreator = GraphActionCreator<
  { fidelity: AvailableTimeUnits; graph: AvailableGraphs },
  typeof SET_GRAPH_FIDELITY
>
export type SetGraphFidelityInterface = GraphAction<
  { fidelity: AvailableTimeUnits; graph: AvailableGraphs },
  typeof SET_GRAPH_FIDELITY
>
export const setGraphFidelity: SetGraphFidelityActionCreator = ({
  fidelity,
  graph,
}) => ({
  type: SET_GRAPH_FIDELITY,
  payload: { fidelity, graph },
})

export type SetGraphHistoricalLengthActionCreator = GraphActionCreator<
  {
    graph: AvailableGraphs
    length: { count: number; unit: string }
  },
  typeof SET_GRAPH_HISTORICAL_LENGTH
>
export type SetGraphHistoricalLengthInterface = GraphAction<
  {
    graph: AvailableGraphs
    length: { count: number; unit: string }
  },
  typeof SET_GRAPH_HISTORICAL_LENGTH
>
export const setGraphHistoricalLength: SetGraphHistoricalLengthActionCreator = ({
  length: { count, unit },
  graph,
}) => ({
  type: SET_GRAPH_HISTORICAL_LENGTH,
  payload: {
    length: { count, unit },
    graph,
  },
})

export type SetHistoricalTypeActionCreator = GraphActionCreator<
  AvailableHistoricalGraphTypes,
  typeof SET_HISTORICAL_TYPE
>
export type SetHistoricalTypeInterface = GraphAction<
  AvailableHistoricalGraphTypes,
  typeof SET_HISTORICAL_TYPE
>
export const setHistoricalType: SetHistoricalTypeActionCreator = type => ({
  type: SET_HISTORICAL_TYPE,
  payload: type,
})
