import React, { FunctionComponent } from 'react'
import {
  SetGraphFidelityActionCreator,
  SetGraphHistoricalLengthActionCreator,
  SetHistoricalTypeActionCreator,
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
import { AvailableHistoricalGraphTypes } from '../../reducers/graph'
import {
  convertDateSelectObject,
  convertDateSelectString,
} from '../../utilities/utils'

interface HistoricalBalancesChartOptionsProps {
  graphFidelity: AvailableTimeUnits
  graphHistoricalLength: {
    [HISTORICAL_TIME_COUNT]: number
    [HISTORICAL_TIME_UNIT]: AvailableTimeUnits
  }
  setGraphFidelityAction: SetGraphFidelityActionCreator
  setGraphHistoricalLengthAction: SetGraphHistoricalLengthActionCreator
  setHistoricalTypeAction: SetHistoricalTypeActionCreator
  type: AvailableHistoricalGraphTypes
}

export const HistoricalBalancesChartOptions: FunctionComponent<HistoricalBalancesChartOptionsProps> = ({
  setGraphHistoricalLengthAction,
  graphFidelity,
  setGraphFidelityAction,
  graphHistoricalLength: { historicalTimeCount, historicalTimeUnit },
  setHistoricalTypeAction,
  type,
}) => (
  <div style={{ display: 'flex' }}>
    <>
      <div className="chart-option-header">Type:</div>
      <select
        className="chart-option-select"
        value={type}
        onChange={e => {
          setHistoricalTypeAction(
            e.target.value as AvailableHistoricalGraphTypes
          )
        }}
      >
        <option value={'grouped'}>Asset vs. Liability</option>
        <option value={'combined'}>Combined</option>
        <option value={'individual'}>Individual</option>
      </select>
    </>
    <>
      <div className="chart-option-header">Group by:</div>
      <select
        className="chart-option-select"
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
