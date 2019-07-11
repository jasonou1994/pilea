import React, { Component } from 'react'
import {
  SetGraphFidelityActionCreator,
  SetSelectedTransactionActionCreator,
} from '../actions'
import {
  TWO_YEARS,
  ONE_YEAR,
  SIX_MONTHS,
  THREE_MONTHS,
  CUSTOM,
} from '../konstants'

interface IncomeSpendingChartOptionsProps {
  setGraphFidelityAction: SetGraphFidelityActionCreator
  graphFidelity: number
  setSelectedTransactionKeyAction: SetSelectedTransactionActionCreator
}

interface IncomeSpendingChartOptionsState {}

export class IncomeSpendingChartOptions extends Component<
  IncomeSpendingChartOptionsProps,
  IncomeSpendingChartOptionsState
> {
  static state = {}

  render() {
    const {
      setGraphFidelityAction,
      graphFidelity,
      setSelectedTransactionKeyAction,
    } = this.props

    return (
      <div style={{ display: 'flex' }}>
        <>
          <div>Group by:</div>
          <select
            value={graphFidelity}
            onChange={e => {
              setSelectedTransactionKeyAction('')
              setGraphFidelityAction(e.target.value)
            }}
          >
            <option value={1}>1 day</option>
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
          </select>
        </>
        <>
          {/* <div>Date range:</div>
          <select value={dateSelect} onChange={e => {}}>
            <option value={TWO_YEARS}>{TWO_YEARS}</option>
            <option value={ONE_YEAR}>{ONE_YEAR}</option>
            <option value={SIX_MONTHS}>{SIX_MONTHS}</option>
            <option value={THREE_MONTHS}>{THREE_MONTHS}</option>
            <option value={CUSTOM}>{CUSTOM}</option>
          </select> */}
        </>
      </div>
    )
  }
}
