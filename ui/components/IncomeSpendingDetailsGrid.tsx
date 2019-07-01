import React, { Component } from 'react'
import { connect } from 'react-redux'

interface IncomeSpendingDetailsGridProps {}

interface IncomeSpendingDetailsGridState {}

export class IncomeSpendingDetailsGrid extends Component<
  IncomeSpendingDetailsGridProps,
  IncomeSpendingDetailsGridState
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
        IncomeSpendingDetailsGrid
      </div>
    )
  }
}
