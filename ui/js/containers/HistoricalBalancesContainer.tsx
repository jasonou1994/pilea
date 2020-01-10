import React, { FunctionComponent, useState, useEffect } from 'react'
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
  type: 'combined' | 'individual'
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
  return (
    <div className="item-historical-balances">
      <h2>Balances</h2>
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
        {...{ type, historicalBalancesLineSeries, windowWidth, windowHeight }}
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
