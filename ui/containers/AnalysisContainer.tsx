import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IncomeSpendingView } from '../components/IncomeSpendingView'
import {
  setGraphFidelity,
  setSelectedTransactionKey,
  SetGraphFidelityActionCreator,
  SetSelectedTransactionActionCreator,
} from '../actions'
import {
  graphFidelitySelector,
  transactionsByDayCountCombinedSelector,
  transactionsByCategorySelector,
  transactionsByNameSelector,
  cardsSelector,
  selectedTransactionKeySelector,
  selectedTransactionsSelector,
  cardsByItemsSelector,
} from '../reducers'
import { PileaCard } from '../sagas/sagas'
import {
  TimeConsolidatedTransactionGroup,
  TimeConsolidatedTransactionGroups,
} from '../reducers/transactionsAccounts'

interface AnalysisContainerProps {
  graphFidelity: number
  transactionsByDayCountCombined: TimeConsolidatedTransactionGroups
  transactionsByCategory: any
  transactionsByName: any
  cards: PileaCard[]
  selectedTransactions: TimeConsolidatedTransactionGroup
  selectedTransactionsKey: string
  setGraphFidelityAction: SetGraphFidelityActionCreator
  setSelectedTransactionKeyAction: SetSelectedTransactionActionCreator
}

interface AnalysisContainerState {}

class _AnalysisContainer extends Component<
  AnalysisContainerProps,
  AnalysisContainerState
> {
  static state = {}

  render() {
    const {
      graphFidelity,
      transactionsByCategory,
      transactionsByDayCountCombined,
      transactionsByName,
      cards,
      selectedTransactions,
      selectedTransactionsKey,
      setGraphFidelityAction,
      setSelectedTransactionKeyAction,
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
            selectedTransactionsKey,
            setGraphFidelityAction,
            setSelectedTransactionKeyAction,
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
    selectedTransactionsKey: selectedTransactionKeySelector(state),
  }),
  {
    setGraphFidelityAction: setGraphFidelity,
    setSelectedTransactionKeyAction: setSelectedTransactionKey,
  }
)(_AnalysisContainer)
