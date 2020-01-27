import React, { Component } from 'react'
import {
  ResetSelectedTransactionActionCreator,
  SetGraphFidelityActionCreator,
  SetGraphHistoricalLengthActionCreator,
} from '../../actions'
import {
  AvailableTimeStrings,
  AvailableTimeUnits,
  DAY,
  HISTORICAL_TIME_COUNT,
  HISTORICAL_TIME_UNIT,
  MONTH,
  ONE_YEAR,
  SIX_MONTHS,
  THREE_MONTHS,
  TWO_YEARS,
  WEEK,
} from '../../konstants'
import {
  convertDateSelectObject,
  convertDateSelectString,
} from '../../utilities/utils'

interface IncomeSpendingChartOptionsProps {
  graphFidelity: AvailableTimeUnits
  graphHistoricalLength: {
    [HISTORICAL_TIME_COUNT]: number
    [HISTORICAL_TIME_UNIT]: AvailableTimeUnits
  }
  resetSelectedTransactionKeyAction: ResetSelectedTransactionActionCreator
  setGraphFidelityAction: SetGraphFidelityActionCreator
  setGraphHistoricalLengthAction: SetGraphHistoricalLengthActionCreator
}

export class IncomeSpendingChartOptions extends Component<
  IncomeSpendingChartOptionsProps
> {
  public render() {
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
          <div className="chart-option-header">Group by:</div>
          <select
            className="chart-option-select"
            value={graphFidelity}
            onChange={e => {
              resetSelectedTransactionKeyAction()
              setGraphFidelityAction({
                fidelity: e.target.value as AvailableTimeUnits,
                graph: 'incomeSpending',
              })
            }}
          >
            <option value={DAY}>Daily</option>
            <option value={WEEK}>Weekly</option>
            <option value={MONTH}>Monthly</option>
          </select>
        </>
        <>
          <div className="chart-option-header">Date range:</div>
          <select
            className="chart-option-select"
            value={convertDateSelectObject({
              historicalTimeCount,
              historicalTimeUnit,
            })}
            onChange={e => {
              const {
                historicalTimeCount,
                historicalTimeUnit,
              } = convertDateSelectString(
                e.target.value as AvailableTimeStrings
              )

              resetSelectedTransactionKeyAction()

              setGraphHistoricalLengthAction({
                graph: 'incomeSpending',
                length: {
                  count: historicalTimeCount,
                  unit: historicalTimeUnit,
                },
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
