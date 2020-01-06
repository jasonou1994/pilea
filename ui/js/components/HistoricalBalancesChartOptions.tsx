import React, { FunctionComponent } from 'react'
import {
  SetHistoricalTypeActionCreator,
  SetGraphFidelityActionCreator,
  SetGraphHistoricalLengthActionCreator,
} from '../actions'
import {
  AvailableTimeUnits,
  HISTORICAL_TIME_COUNT,
  HISTORICAL_TIME_UNIT,
  DAY,
  WEEK,
  MONTH,
  AvailableTimeStrings,
  TWO_YEARS,
  ONE_YEAR,
  SIX_MONTHS,
  THREE_MONTHS,
} from '../konstants'
import {
  convertDateSelectObject,
  convertDateSelectString,
} from '../utilities/utils'

interface HistoricalBalancesChartOptionsProps {
  setGraphFidelityAction: SetGraphFidelityActionCreator
  graphFidelity: AvailableTimeUnits
  setGraphHistoricalLengthAction: SetGraphHistoricalLengthActionCreator
  graphHistoricalLength: {
    [HISTORICAL_TIME_COUNT]: number
    [HISTORICAL_TIME_UNIT]: AvailableTimeUnits
  }
  setHistoricalTypeAction: SetHistoricalTypeActionCreator
}

export const HistoricalBalancesChartOptions: FunctionComponent<HistoricalBalancesChartOptionsProps> = ({
  setGraphHistoricalLengthAction,
  graphFidelity,
  setGraphFidelityAction,
  graphHistoricalLength: { historicalTimeCount, historicalTimeUnit },
  setHistoricalTypeAction,
}) => (
  <div style={{ display: 'flex' }}>
    <>
      <div>Group by:</div>
      <select
        value={graphFidelity}
        onChange={e => {
          setGraphFidelityAction({
            fidelity: e.target.value as AvailableTimeUnits,
            graph: 'historicalBalances',
          })
        }}
      >
        <option value={DAY}>Daily</option>
        <option value={WEEK}>Weekly</option>
        <option value={MONTH}>Monthly</option>
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
          } = convertDateSelectString(e.target.value as AvailableTimeStrings)

          setGraphHistoricalLengthAction({
            graph: 'historicalBalances',
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
