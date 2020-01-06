import React, { Component, FunctionComponent } from 'react'
import { connect } from 'react-redux'
import {
  setGraphFidelity,
  setSelectedTransactionKey,
  SetGraphFidelityActionCreator,
  SetSelectedTransactionActionCreator,
  setGraphHistoricalLength,
  SetGraphHistoricalLengthActionCreator,
  resetSelectedTransactionKey,
  ResetSelectedTransactionActionCreator,
} from '../actions'
import {
  TimeConsolidatedTransactionGroup,
  RootState,
  itemsWithCardsSelector,
  selectedTransactionsSelector,
  incomeSpendingLineSeriesSelector,
  GraphLineSeries,
} from '../reducers'
import { PileaCard } from '../sagas/sagas'
import {
  HISTORICAL_TIME_COUNT,
  HISTORICAL_TIME_UNIT,
  AvailableTimeUnits,
} from '../konstants'
import '../../scss/index.scss'
import {
  incomeSpendingGraphFidelitySelector,
  incomeSpendingGraphHistoricalLengthSelector,
} from '../reducers/graph'
import { cardsSelector } from '../reducers/transactionsAccounts'
import {
  windowWidthSelector,
  filterSidebarWidthSelector,
} from '../reducers/sizing'
import { IncomeSpendingChart } from '../components/IncomeSpendingChart'
import { IncomeSpendingChartOptions } from '../components/IncomeSpendingChartOptions'
import { IncomeSpendingDetailsGrid } from '../components/IncomeSpendingDetailsGrid'

interface AnalysisContainerProps {
  graphFidelity: AvailableTimeUnits
  cards: PileaCard[]
  selectedTransactions: TimeConsolidatedTransactionGroup
  setGraphFidelityAction: SetGraphFidelityActionCreator
  setSelectedTransactionKeyAction: SetSelectedTransactionActionCreator
  setGraphHistoricalLengthAction: SetGraphHistoricalLengthActionCreator
  graphHistoricalLength: {
    [HISTORICAL_TIME_COUNT]: number
    [HISTORICAL_TIME_UNIT]: AvailableTimeUnits
  }
  resetSelectedTransactionKeyAction: ResetSelectedTransactionActionCreator
  windowWidth: number
  filterSidebarWidth: number
  lineSeries: GraphLineSeries
}

const AnalysisContainer: FunctionComponent<AnalysisContainerProps> = ({
  graphFidelity,

  cards,
  selectedTransactions,
  setGraphFidelityAction,
  setSelectedTransactionKeyAction,
  setGraphHistoricalLengthAction,
  graphHistoricalLength,
  resetSelectedTransactionKeyAction,
  windowWidth,
  filterSidebarWidth,
  lineSeries,
}) => {
  return (
    <div id="analysis">
      <div>
        <h2>Income and Spending</h2>
        <IncomeSpendingChart
          {...{
            lineSeries,
            windowWidth,

            setSelectedTransactionKeyAction,
          }}
        />
        <IncomeSpendingChartOptions
          {...{
            setGraphFidelityAction,
            graphFidelity,
            setGraphHistoricalLengthAction,
            graphHistoricalLength,
            resetSelectedTransactionKeyAction,
          }}
        />
        <IncomeSpendingDetailsGrid
          {...{
            allowedWidth: windowWidth - filterSidebarWidth - 70,
            cards,
            selectedTransactions,
          }}
        />
      </div>
    </div>
  )
}

export default connect(
  (state: RootState) => ({
    graphFidelity: incomeSpendingGraphFidelitySelector(state),
    cards: cardsSelector(state),
    cardsByItems: itemsWithCardsSelector(state),
    selectedTransactions: selectedTransactionsSelector(state),
    graphHistoricalLength: incomeSpendingGraphHistoricalLengthSelector(state),
    windowWidth: windowWidthSelector(state),
    filterSidebarWidth: filterSidebarWidthSelector(state),
    lineSeries: incomeSpendingLineSeriesSelector(state),
  }),
  {
    setGraphFidelityAction: setGraphFidelity,
    setSelectedTransactionKeyAction: setSelectedTransactionKey,
    setGraphHistoricalLengthAction: setGraphHistoricalLength,
    resetSelectedTransactionKeyAction: resetSelectedTransactionKey,
  }
)(AnalysisContainer)
