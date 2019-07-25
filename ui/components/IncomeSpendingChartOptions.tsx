import React, { Component } from 'react'
import {
  SetGraphFidelityActionCreator,
  SetSelectedTransactionActionCreator,
  SetGraphHistoricalLengthActionCreator,
  ResetSelectedTransactionActionCreator,
} from '../actions'
import {
  HISTORICAL_TIME_COUNT,
  HISTORICAL_TIME_UNIT,
  AvailableTimeUnits,
  TWO_YEARS,
  ONE_YEAR,
  SIX_MONTHS,
  THREE_MONTHS,
  CUSTOM,
  AvailableTimeStrings,
} from '../konstants'
import {
  convertDateSelectString,
  convertDateSelectObject,
} from '../utilities/utils'

interface IncomeSpendingChartOptionsProps {
  setGraphFidelityAction: SetGraphFidelityActionCreator
  graphFidelity: number
  setGraphHistoricalLengthAction: SetGraphHistoricalLengthActionCreator
  graphHistoricalLength: {
    [HISTORICAL_TIME_COUNT]: number
    [HISTORICAL_TIME_UNIT]: AvailableTimeUnits
  }
  resetSelectedTransactionKeyAction: ResetSelectedTransactionActionCreator
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
      setGraphHistoricalLengthAction,
      graphHistoricalLength: { historicalTimeCount, historicalTimeUnit },
      resetSelectedTransactionKeyAction,
    } = this.props

    return (
      <div style={{ display: 'flex' }}>
        <>
          <div>Group by:</div>
          <select
            value={graphFidelity}
            onChange={e => {
              resetSelectedTransactionKeyAction()
              setGraphFidelityAction(e.target.value)
            }}
          >
            <option value={1}>1 day</option>
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
          </select>
        </>
        <>
          <div>Date range:</div>
          <select
            value={convertDateSelectObject({
              historicalTimeCount,
              historicalTimeUnit,
            })}
            onChange={e => {
              const {
                historicalTimeCount,
                historicalTimeUnit,
              } = convertDateSelectString(e.target
                .value as AvailableTimeStrings)

              resetSelectedTransactionKeyAction()
              setGraphHistoricalLengthAction({
                count: historicalTimeCount,
                unit: historicalTimeUnit,
              })
            }}
          >
            <option value={TWO_YEARS}>{TWO_YEARS}</option>
            <option value={ONE_YEAR}>{ONE_YEAR}</option>
            <option value={SIX_MONTHS}>{SIX_MONTHS}</option>
            <option value={THREE_MONTHS}>{THREE_MONTHS}</option>
          </select>
        </>
      </div>
    )
  }
}
