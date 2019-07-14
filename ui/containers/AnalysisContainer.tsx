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
} from '../actions'
import {
  graphFidelitySelector,
  transactionsByDayCountCombinedSelector,
  transactionsByCategorySelector,
  transactionsByNameSelector,
  cardsSelector,
  selectedTransactionsSelector,
  cardsByItemsSelector,
  graphHistoricalLengthSelector,
  TimeConsolidatedTransactionGroups,
  TimeConsolidatedTransactionGroup,
} from '../reducers'
import { PileaCard } from '../sagas/sagas'
import {
  HISTORICAL_TIME_COUNT,
  HISTORICAL_TIME_UNIT,
  AvailableTimeUnits,
} from '../konstants'

interface AnalysisContainerProps {
  graphFidelity: number
  transactionsByDayCountCombined: TimeConsolidatedTransactionGroups
  transactionsByCategory: any
  transactionsByName: any
  cards: PileaCard[]
  selectedTransactions: TimeConsolidatedTransactionGroup
  setGraphFidelityAction: SetGraphFidelityActionCreator
  setSelectedTransactionKeyAction: SetSelectedTransactionActionCreator
  setGraphHistoricalLengthAction: SetGraphHistoricalLengthActionCreator
  graphHistoricalLength: {
    [HISTORICAL_TIME_COUNT]: number
    [HISTORICAL_TIME_UNIT]: AvailableTimeUnits
  }
}

interface AnalysisContainerState {}

class _AnalysisContainer extends Component<
  AnalysisContainerProps,
  AnalysisContainerState
> {
  render() {
    const {
      graphFidelity,
      transactionsByCategory,
      transactionsByDayCountCombined,
      transactionsByName,
      cards,
      selectedTransactions,
      setGraphFidelityAction,
      setSelectedTransactionKeyAction,
      setGraphHistoricalLengthAction,
      graphHistoricalLength,
    } = this.props

    return (
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        AnalysisContainer
        <IncomeSpendingView
          {...{
            graphFidelity,
            transactionsByCategory,
            transactionsByDayCountCombined,
            transactionsByName,
            cards,
            selectedTransactions,
            setGraphFidelityAction,
            setSelectedTransactionKeyAction,
            setGraphHistoricalLengthAction,
            graphHistoricalLength,
          }}
        />
      </div>
    )
  }
}

export default connect(
  state => ({
    graphFidelity: graphFidelitySelector(state),
    transactionsByDayCountCombined: transactionsByDayCountCombinedSelector(
      state
    ),
    transactionsByCategory: transactionsByCategorySelector(state),
    transactionsByName: transactionsByNameSelector(state),
    cards: cardsSelector(state),
    cardsByItems: cardsByItemsSelector(state),
    selectedTransactions: selectedTransactionsSelector(state),
    graphHistoricalLength: graphHistoricalLengthSelector(state),
  }),
  {
    setGraphFidelityAction: setGraphFidelity,
    setSelectedTransactionKeyAction: setSelectedTransactionKey,
    setGraphHistoricalLengthAction: setGraphHistoricalLength,
  }
)(_AnalysisContainer)
