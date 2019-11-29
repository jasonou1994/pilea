import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IncomeSpendingView } from '../components/IncomeSpendingView'
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
  graphFidelitySelector,
  transactionsByDayCountCombinedSelector,
  cardsSelector,
  selectedTransactionsSelector,
  cardsByItemsSelector,
  graphHistoricalLengthSelector,
  TimeConsolidatedTransactionGroups,
  TimeConsolidatedTransactionGroup,
  RootState,
  windowWidthSelector,
} from '../reducers'
import { PileaCard } from '../sagas/sagas'
import {
  HISTORICAL_TIME_COUNT,
  HISTORICAL_TIME_UNIT,
  AvailableTimeUnits,
} from '../konstants'
import '../../scss/index.scss'

interface AnalysisContainerProps {
  graphFidelity: AvailableTimeUnits
  transactionsByDayCountCombined: TimeConsolidatedTransactionGroups
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
}

interface AnalysisContainerState {}

class _AnalysisContainer extends Component<
  AnalysisContainerProps,
  AnalysisContainerState
> {
  render() {
    const {
      graphFidelity,
      transactionsByDayCountCombined,
      cards,
      selectedTransactions,
      setGraphFidelityAction,
      setSelectedTransactionKeyAction,
      setGraphHistoricalLengthAction,
      graphHistoricalLength,
      resetSelectedTransactionKeyAction,
      windowWidth,
    } = this.props

    return (
      <div id="analysis">
        <IncomeSpendingView
          {...{
            graphFidelity,
            transactionsByDayCountCombined,
            cards,
            selectedTransactions,
            setGraphFidelityAction,
            setSelectedTransactionKeyAction,
            setGraphHistoricalLengthAction,
            graphHistoricalLength,
            resetSelectedTransactionKeyAction,
            windowWidth,
          }}
        />
      </div>
    )
  }
}

export default connect(
  (state: RootState) => ({
    graphFidelity: graphFidelitySelector(state),
    transactionsByDayCountCombined: transactionsByDayCountCombinedSelector(
      state
    ),
    cards: cardsSelector(state),
    cardsByItems: cardsByItemsSelector(state),
    selectedTransactions: selectedTransactionsSelector(state),
    graphHistoricalLength: graphHistoricalLengthSelector(state),
    windowWidth: windowWidthSelector(state),
  }),
  {
    setGraphFidelityAction: setGraphFidelity,
    setSelectedTransactionKeyAction: setSelectedTransactionKey,
    setGraphHistoricalLengthAction: setGraphHistoricalLength,
    resetSelectedTransactionKeyAction: resetSelectedTransactionKey,
  }
)(_AnalysisContainer)
