import React, { FunctionComponent } from 'react'
import { cardsSelector } from '../reducers/transactionsAccounts'
import { connect } from 'react-redux'
import {
  RootState,
  historicalBalancesLineSeriesSelector,
  HistoricalBalanceLineSeries,
} from '../reducers'
import { HistoricalBalancesChart } from '../components/historicalBalances/HistoricalBalancesChart'
import {
  HISTORICAL_TIME_COUNT,
  HISTORICAL_TIME_UNIT,
  AvailableTimeUnits,
} from '../konstants'
import {
  historicalGraphHistoricalLengthSelector,
  historicalGraphFidelitySelector,
  historicalGraphTypeSelector,
  AvailableHistoricalGraphTypes,
} from '../reducers/graph'
import {
  setGraphFidelity,
  setGraphHistoricalLength,
  SetGraphFidelityActionCreator,
  SetGraphHistoricalLengthActionCreator,
  resetSelectedTransactionKey,
  ResetSelectedTransactionActionCreator,
  setHistoricalType,
  SetHistoricalTypeActionCreator,
} from '../actions'
import { windowWidthSelector, windowHeightSelector } from '../reducers/sizing'
import { HistoricalBalancesChartOptions } from '../components/historicalBalances/HistoricalBalancesChartOptions'

interface Props {
  historicalBalancesLineSeries: HistoricalBalanceLineSeries
  type: AvailableHistoricalGraphTypes
  graphHistoricalLength: {
    [HISTORICAL_TIME_COUNT]: number
    [HISTORICAL_TIME_UNIT]: AvailableTimeUnits
  }
  graphFidelity: AvailableTimeUnits
  setGraphFidelityAction: SetGraphFidelityActionCreator
  setGraphHistoricalLengthAction: SetGraphHistoricalLengthActionCreator
  resetSelectedTransactionKeyAction: ResetSelectedTransactionActionCreator
  windowWidth: number
  windowHeight: number
  setHistoricalTypeAction: SetHistoricalTypeActionCreator
}

const _HistoricalBalancesContainer: FunctionComponent<Props> = ({
  historicalBalancesLineSeries,
  type,
  graphHistoricalLength,
  graphFidelity,
  setGraphFidelityAction,
  setGraphHistoricalLengthAction,
  windowWidth,
  windowHeight,
  setHistoricalTypeAction,
}) => {
  const titleType =
    type === 'individual'
      ? 'Individual Account Balances'
      : type === 'grouped'
      ? 'Account Balances Grouped by Assets vs. Liabilities'
      : 'Combined Account Balances'

  const titleTimeFidelity =
    graphFidelity === 'year'
      ? 'Yearly'
      : graphFidelity === 'month'
      ? 'Monthly'
      : graphFidelity === 'week'
      ? 'Weekly'
      : 'Daily'

  const titleTimeDuration = graphHistoricalLength[HISTORICAL_TIME_COUNT]
  const titleTimeUnit =
    graphHistoricalLength[HISTORICAL_TIME_UNIT] === 'year'
      ? 'Year(s)'
      : graphHistoricalLength[HISTORICAL_TIME_UNIT] === 'month'
      ? 'Month(s)'
      : graphHistoricalLength[HISTORICAL_TIME_UNIT] === 'week'
      ? 'Week(s)'
      : 'Day(s)'

  return (
    <div className="item-historical-balances">
      <h4>{`${titleType} Displayed ${titleTimeFidelity} for the Past ${titleTimeDuration} ${titleTimeUnit}`}</h4>
      <HistoricalBalancesChartOptions
        {...{
          type,
          setGraphFidelityAction,
          graphFidelity,
          setGraphHistoricalLengthAction,
          graphHistoricalLength,
          setHistoricalTypeAction,
        }}
      />
      <HistoricalBalancesChart
        {...{
          type,
          historicalBalancesLineSeries,
          height: windowHeight - 230,
          width: windowWidth - 265,
        }}
      />
    </div>
  )
}

export const HistoricalBalancesContainer = connect(
  (state: RootState) => ({
    historicalBalancesLineSeries: historicalBalancesLineSeriesSelector(state),
    graphHistoricalLength: historicalGraphHistoricalLengthSelector(state),
    graphFidelity: historicalGraphFidelitySelector(state),
    type: historicalGraphTypeSelector(state),
    windowWidth: windowWidthSelector(state),
    windowHeight: windowHeightSelector(state),
    cards: cardsSelector(state),
  }),
  {
    setGraphFidelityAction: setGraphFidelity,
    setGraphHistoricalLengthAction: setGraphHistoricalLength,
    resetSelectedTransactionKeyAction: resetSelectedTransactionKey,
    setHistoricalTypeAction: setHistoricalType,
  }
)(_HistoricalBalancesContainer)
