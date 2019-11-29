import React, { Component } from 'react'
import { IncomeSpendingChart } from './IncomeSpendingChart'
import { IncomeSpendingChartOptions } from './IncomeSpendingChartOptions'
import { IncomeSpendingDetailsGrid } from './IncomeSpendingDetailsGrid'
import { PileaCard } from '../sagas/sagas'
import {
  SetGraphFidelityActionCreator,
  SetSelectedTransactionActionCreator,
  SetGraphHistoricalLengthActionCreator,
  ResetSelectedTransactionActionCreator,
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
  filterSidebarWidth: number
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
      transactionsByDayCountCombined,
      cards,
      selectedTransactions,
      setGraphFidelityAction,
      setSelectedTransactionKeyAction,
      setGraphHistoricalLengthAction,
      graphHistoricalLength,
      resetSelectedTransactionKeyAction,
      windowWidth,
      filterSidebarWidth,
    } = this.props

    return (
      <div>
        <h2>Income and Spending</h2>
        <IncomeSpendingChart
          {...{
            windowWidth,
            transactionsByDayCountCombined,
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
    )
  }
}
