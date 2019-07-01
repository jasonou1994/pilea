import React, { Component } from 'react'
import { connect } from 'react-redux'

interface IncomeSpendingChartProps {}

interface IncomeSpendingChartState {}

export class IncomeSpendingChart extends Component<
  IncomeSpendingChartProps,
  IncomeSpendingChartState
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
        IncomeSpendingChart
      </div>
    )
  }
}
