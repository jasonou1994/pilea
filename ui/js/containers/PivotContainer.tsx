import React, { FunctionComponent } from 'react'
import { connect } from 'react-redux'
import {
  RootState,
  consolidatedDataSelector,
  FlattenedTransaction,
} from '../reducers'
import { Pivot } from '../components/Pivot'

interface PivotContainerProps {
  consolidatedData: FlattenedTransaction[]
}

interface Memo {
  count: number
  amountTotal: number
  largestTransaction: {
    amount: number
    date: string
    merchant: string
  }
  smallestTransaction: {
    amount: number
    date: string
    merchant: string
  }
}

const _PivotContainer: FunctionComponent<PivotContainerProps> = ({
  consolidatedData,
}) => {
  const dimensions = [
    { value: 'item', title: 'Account' },
    { value: 'card', title: 'Card' },
    { value: 'name', title: 'Merchant' },
    { value: 'date', title: 'Date' },
    { value: 'category', title: 'Category' },
  ]
  const reduce = (row: FlattenedTransaction, memo: Memo) => {
    if (!memo.largestTransaction) {
      memo.largestTransaction = {
        amount: row.amount,
        date: row.date,
        merchant: row.name,
      }
      memo.smallestTransaction = {
        amount: row.amount,
        date: row.date,
        merchant: row.name,
      }
    }

    memo.amountTotal = (memo.amountTotal || 0) + row.amount

    memo.count = (memo.count || 0) + 1

    return memo
  }
  const calculations = [
    {
      title: 'Count',
      value: 'count',

      sortBy: function(row: any) {
        return isNaN(row.count) ? 0 : row.count
      },
    },
    {
      title: 'Sum Amount',
      value: 'amountTotal',
      template: function(val: any, row: any) {
        return '$' + val.toFixed(2)
      },
      sortBy: function(row: any) {
        return isNaN(row.amountTotal) ? 0 : row.amountTotal
      },
      className: 'alignRight',
    },
    {
      title: 'Average Amount',
      value: (memo: Memo) => memo.amountTotal / memo.count,
      template: function(val: any, row: any) {
        return '$' + val.toFixed(2)
      },
      sortBy: function(row: any) {
        return isNaN(row.amountTotal) ? 0 : row.amountTotal
      },
      className: 'alignRight',
    },
  ]

  return (
    <>
      <h2>Pivot</h2>
      <Pivot
        {...{
          reduce,
          rows: consolidatedData,
          dimensions,
          calculations,
          activeDimensions: ['Merchant'],
          sortBy: 'Count',
          sortDir: 'desc',
        }}
      />
    </>
  )
}

export const PivotContainer = connect(
  (state: RootState) => ({
    consolidatedData: consolidatedDataSelector(state),
  }),
  {}
)(_PivotContainer)
