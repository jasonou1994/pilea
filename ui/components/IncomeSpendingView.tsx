import React, { Component } from 'react'
import { IncomeSpendingChart } from './IncomeSpendingChart'
import { IncomeSpendingChartOptions } from './IncomeSpendingChartOptions'
import { IncomeSpendingDetailsGrid } from './IncomeSpendingDetailsGrid'
import { PileaCard } from '../sagas/sagas'
import { Transaction as PlaidTransaction } from 'plaid'
import {
  SetGraphFidelityActionCreator,
  SetSelectedTransactionActionCreator,
} from '../actions'
import {
  TimeConsolidatedTransactionGroups,
  TimeConsolidatedTransactionGroup,
} from '../reducers/transactionsAccounts'

interface IncomeSpendingViewProps {
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

interface IncomeSpendingViewState {}

export class IncomeSpendingView extends Component<
  IncomeSpendingViewProps,
  IncomeSpendingViewState
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
        IncomeSpendingView
        <IncomeSpendingChart
          {...{
            transactionsByCategory,
            transactionsByDayCountCombined,
            transactionsByName,
            setSelectedTransactionKeyAction,
          }}
        />
        <IncomeSpendingChartOptions
          {...{
            setGraphFidelityAction,
            setSelectedTransactionKeyAction,
            graphFidelity,
          }}
        />
        <IncomeSpendingDetailsGrid {...{ cards, selectedTransactions }} />
      </div>
    )
  }
}
