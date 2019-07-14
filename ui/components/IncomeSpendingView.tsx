import React, { Component } from 'react'
import { IncomeSpendingChart } from './IncomeSpendingChart'
import { IncomeSpendingChartOptions } from './IncomeSpendingChartOptions'
import { IncomeSpendingDetailsGrid } from './IncomeSpendingDetailsGrid'
import { PileaCard } from '../sagas/sagas'
import { Transaction as PlaidTransaction } from 'plaid'
import {
  SetGraphFidelityActionCreator,
  SetSelectedTransactionActionCreator,
  SetGraphHistoricalLengthActionCreator,
} from '../actions'
import {
  HISTORICAL_TIME_COUNT,
  HISTORICAL_TIME_UNIT,
  AvailableTimeUnits,
} from '../konstants'
import {
  TimeConsolidatedTransactionGroups,
  TimeConsolidatedTransactionGroup,
} from '../reducers'

interface IncomeSpendingViewProps {
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
            setGraphHistoricalLengthAction,
            graphHistoricalLength,
          }}
        />
        <IncomeSpendingDetailsGrid {...{ cards, selectedTransactions }} />
      </div>
    )
  }
}
