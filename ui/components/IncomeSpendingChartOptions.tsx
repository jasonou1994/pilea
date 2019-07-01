import React, { Component } from 'react'
import { connect } from 'react-redux'

interface IncomeSpendingChartOptionsProps {}

interface IncomeSpendingChartOptionsState {}

export class IncomeSpendingChartOptions extends Component<
  IncomeSpendingChartOptionsProps,
  IncomeSpendingChartOptionsState
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
        IncomeSpendingChartOptions
      </div>
    )
  }
}
