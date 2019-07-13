import { SET_GRAPH_FIDELITY } from '../konstants/index'
import { Action } from 'redux'

export type GraphActionTypes = typeof SET_GRAPH_FIDELITY

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
