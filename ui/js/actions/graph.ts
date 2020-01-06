import {
  SET_GRAPH_FIDELITY,
  SET_GRAPH_HISTORICAL_LENGTH,
  AvailableTimeUnits,
  AvailableGraphs,
  SET_HISTORICAL_TYPE,
} from '../konstants/index'
import { Action } from 'redux'

type GraphActionTypes =
  | typeof SET_GRAPH_FIDELITY
  | typeof SET_GRAPH_HISTORICAL_LENGTH
  | typeof SET_HISTORICAL_TYPE

export type GraphInterfaces =
  | SetGraphFidelityInterface
  | SetGraphHistoricalLengthInterface

// Generics
export interface GraphAction<P, AT extends GraphActionTypes>
  extends Action<AT> {
  type: AT
  payload: P
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
    length: { count: number; unit: string }
    graph: AvailableGraphs
  },
  typeof SET_GRAPH_HISTORICAL_LENGTH
>
export type SetGraphHistoricalLengthInterface = GraphAction<
  {
    length: { count: number; unit: string }
    graph: AvailableGraphs
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
  'combined' | 'individual',
  typeof SET_GRAPH_HISTORICAL_LENGTH
>
export type SetHistoricalTypeInterface = GraphAction<
  'combined' | 'individual',
  typeof SET_GRAPH_HISTORICAL_LENGTH
>
export const setHistoricalType: SetHistoricalTypeActionCreator = type => ({
  type: SET_GRAPH_HISTORICAL_LENGTH,
  payload: type,
})
