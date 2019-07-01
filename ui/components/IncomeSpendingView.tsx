import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IncomeSpendingChart } from './IncomeSpendingChart'
import { IncomeSpendingChartOptions } from './IncomeSpendingChartOptions'
import { IncomeSpendingDetailsGrid } from './IncomeSpendingDetailsGrid'

interface IncomeSpendingViewProps {}

interface IncomeSpendingViewState {}

export class IncomeSpendingView extends Component<
  IncomeSpendingViewProps,
  IncomeSpendingViewState
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
        IncomeSpendingView
        <IncomeSpendingChart />
        <IncomeSpendingChartOptions />
        <IncomeSpendingDetailsGrid />
      </div>
    )
  }
}
