import {
  SET_GRAPH_FIDELITY,
  SET_START_DATE,
  SET_END_DATE,
} from '../konstants/index'
import { Action } from 'redux'

export type GraphActionTypes =
  | typeof SET_GRAPH_FIDELITY
  | typeof SET_START_DATE
  | typeof SET_END_DATE

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
  string,
  typeof SET_GRAPH_FIDELITY
>
export const setGraphFidelity: SetGraphFidelityActionCreator = fidelity => ({
  type: SET_GRAPH_FIDELITY,
  payload: fidelity,
})

export type SetStartDateActionCreator = GraphActionCreator<
  string,
  typeof SET_START_DATE
>
export const setStartDate: SetStartDateActionCreator = startDate => ({
  type: SET_START_DATE,
  payload: startDate,
})

export type SetEndDateActionCreator = GraphActionCreator<
  string,
  typeof SET_END_DATE
>
export const setEndDate: SetEndDateActionCreator = endDate => ({
  type: SET_END_DATE,
  payload: endDate,
})
