import {
  SET_GRAPH_FIDELITY,
  SET_GRAPH_HISTORICAL_LENGTH,
  DAY,
  WEEK,
  MONTH,
  AvailableTimeUnits,
} from '../konstants/index'
import { Action } from 'redux'

type GraphActionTypes =
  | typeof SET_GRAPH_FIDELITY
  | typeof SET_GRAPH_HISTORICAL_LENGTH

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
  AvailableTimeUnits,
  typeof SET_GRAPH_FIDELITY
>
export type SetGraphFidelityInterface = GraphAction<
  AvailableTimeUnits,
  typeof SET_GRAPH_FIDELITY
>
export const setGraphFidelity: SetGraphFidelityActionCreator = fidelity => ({
  type: SET_GRAPH_FIDELITY,
  payload: fidelity,
})

export type SetGraphHistoricalLengthActionCreator = GraphActionCreator<
  { count: number; unit: string },
  typeof SET_GRAPH_HISTORICAL_LENGTH
>
export type SetGraphHistoricalLengthInterface = GraphAction<
  { count: number; unit: string },
  typeof SET_GRAPH_HISTORICAL_LENGTH
>
export const setGraphHistoricalLength: SetGraphHistoricalLengthActionCreator = ({
  count,
  unit,
}) => ({ type: SET_GRAPH_HISTORICAL_LENGTH, payload: { count, unit } })
