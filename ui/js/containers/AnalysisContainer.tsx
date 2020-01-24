import React, { FunctionComponent } from 'react'
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
  windowHeightSelector,
} from '../reducers/sizing'
import { IncomeSpendingChart } from '../components/incomeSpending/IncomeSpendingChart'
import { IncomeSpendingChartOptions } from '../components/incomeSpending/IncomeSpendingChartOptions'
import { IncomeSpendingDetailsGrid } from '../components/incomeSpending/IncomeSpendingDetailsGrid'
import { selectedTransactionKeySelector } from '../reducers/grid'
import moment from 'moment'

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
  windowHeight: number
  filterSidebarWidth: number
  lineSeries: GraphLineSeries
  selectedTransactionKey: string
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
  windowHeight,
  filterSidebarWidth,
  lineSeries,
  selectedTransactionKey,
}) => {
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
    <div id="analysis">
      {!selectedTransactions ||
      selectedTransactions.transactions.length === 0 ? (
        <>
          <h4>{`Income and Spending Displayed ${titleTimeFidelity} for the Past ${titleTimeDuration} ${titleTimeUnit}`}</h4>
          <IncomeSpendingChartOptions
            {...{
              setGraphFidelityAction,
              graphFidelity,
              setGraphHistoricalLengthAction,
              graphHistoricalLength,
              resetSelectedTransactionKeyAction,
            }}
          />

          <div className="income-spending-click-detail-popup">
            Click on a datapoint to analyze transactions
          </div>

          <IncomeSpendingChart
            {...{
              lineSeries,
              width: windowWidth - 330,
              height: windowHeight - 250,
              setSelectedTransactionKeyAction,
            }}
          />
        </>
      ) : (
        <IncomeSpendingDetailsGrid
          {...{
            width: windowWidth - filterSidebarWidth - 70,
            cards,
            selectedTransactions,
            historicalDuration: graphFidelity,
            resetSelectedTransactionKeyAction,
            startingDate: moment(selectedTransactionKey).format(
              'dddd, MMMM Do YYYY'
            ),
          }}
        />
      )}
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
    windowHeight: windowHeightSelector(state),
    selectedTransactionKey: selectedTransactionKeySelector(state),

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
