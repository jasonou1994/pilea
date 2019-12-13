import React, { FunctionComponent } from 'react'
import { connect } from 'react-redux'
// @ts-ignore
// import ReactPivot from 'react-pivot'
import {
  RootState,
  consolidatedDataSelector,
  FlattenedTransaction,
} from '../reducers'

interface PivotContainerProps {
  consolidatedData: FlattenedTransaction[]
}

const _PivotContainer: FunctionComponent<PivotContainerProps> = ({
  consolidatedData,
}) => {
  return <ReactPivot></ReactPivot>
}

export const PivotContainer = connect(
  (state: RootState) => ({
    consolidatedData: consolidatedDataSelector(state),
  }),
  {}
)(_PivotContainer)
