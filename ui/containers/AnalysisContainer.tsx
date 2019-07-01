import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IncomeSpendingView } from '../components/IncomeSpendingView'

interface AnalysisContainerProps {}

interface AnalysisContainerState {}

class _AnalysisContainer extends Component<
  AnalysisContainerProps,
  AnalysisContainerState
> {
  static state = {}

  render() {
    return (
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        AnalysisContainer
        <IncomeSpendingView />
      </div>
    )
  }
}

export default connect(
  state => ({}),
  {}
)(_AnalysisContainer)
