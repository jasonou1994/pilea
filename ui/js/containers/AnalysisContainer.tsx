import moment from 'moment'
import React, { FunctionComponent } from 'react'
import { connect } from 'react-redux'
import '../../scss/index.scss'
import {
  ResetSelectedTransactionActionCreator,
  resetSelectedTransactionKey,
  setGraphFidelity,
  SetGraphFidelityActionCreator,
  setGraphHistoricalLength,
  SetGraphHistoricalLengthActionCreator,
  SetSelectedTransactionActionCreator,
  setSelectedTransactionKey,
} from '../actions'
import { IncomeSpendingChart } from '../components/incomeSpending/IncomeSpendingChart'
import { IncomeSpendingChartOptions } from '../components/incomeSpending/IncomeSpendingChartOptions'
import { IncomeSpendingDetailsGrid } from '../components/incomeSpending/IncomeSpendingDetailsGrid'
import {
  AvailableTimeUnits,
  HISTORICAL_TIME_COUNT,
  HISTORICAL_TIME_UNIT,
} from '../konstants'
import {
  GraphLineSeries,
  incomeSpendingLineSeriesSelector,
  itemsWithCardsSelector,
  RootState,
  selectedTransactionsSelector,
  TimeConsolidatedTransactionGroup,
} from '../reducers'
import {
  incomeSpendingGraphFidelitySelector,
  incomeSpendingGraphHistoricalLengthSelector,
} from '../reducers/graph'
import { selectedTransactionKeySelector } from '../reducers/grid'
import {
  filterSidebarWidthSelector,
  windowHeightSelector,
  windowWidthSelector,
} from '../reducers/sizing'
import { cardsSelector } from '../reducers/transactionsAccounts'
import { PileaCard } from '../sagas/sagas'

interface AnalysisContainerProps {
  cards: PileaCard[]
  filterSidebarWidth: number
  graphFidelity: AvailableTimeUnits
  graphHistoricalLength: {
    [HISTORICAL_TIME_COUNT]: number
    [HISTORICAL_TIME_UNIT]: AvailableTimeUnits
  }
  lineSeries: GraphLineSeries
  resetSelectedTransactionKeyAction: ResetSelectedTransactionActionCreator
  selectedTransactionKey: string
  selectedTransactions: TimeConsolidatedTransactionGroup
  setGraphFidelityAction: SetGraphFidelityActionCreator
  setGraphHistoricalLengthAction: SetGraphHistoricalLengthActionCreator
  setSelectedTransactionKeyAction: SetSelectedTransactionActionCreator
  windowHeight: number
  windowWidth: number
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
            startingDate: moment(selectedTransactionKey).valueOf(),
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
