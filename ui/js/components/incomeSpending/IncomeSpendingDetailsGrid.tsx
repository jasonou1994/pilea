import React, { FunctionComponent, useState, useEffect } from 'react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import { AgGridReact } from 'ag-grid-react'
import numeral from 'numeral'

import { PileaCard } from '../../sagas/sagas'
import { TimeConsolidatedTransactionGroup } from '../../reducers'
import { GridColumnDef, getDataGridColumnDefs } from '../../utilities/layout'
import { GRID_LAYOUT_BY_TIME } from '../../konstants'
import { getCardName } from '../../utilities/utils'
import { ResetSelectedTransactionActionCreator } from '../../actions'

interface IncomeSpendingDetailsGridProps {
  cards: PileaCard[]
  selectedTransactions: TimeConsolidatedTransactionGroup
  width: number
  // height: number
  resetSelectedTransactionKeyAction: ResetSelectedTransactionActionCreator
  historicalDuration: string
  startingDate: string
}

export const IncomeSpendingDetailsGrid: FunctionComponent<IncomeSpendingDetailsGridProps> = ({
  cards,
  selectedTransactions,
  selectedTransactions: { transactions, input, output },
  width,
  resetSelectedTransactionKeyAction,
  historicalDuration,
  startingDate,
  // height,
}) => {
  const [columnDefs, setColumnDefs] = useState<GridColumnDef[]>([])
  const [rowData, setRowData] = useState([])

  useEffect(() => {
    const rawColumnDefs: GridColumnDef[] = getDataGridColumnDefs(
      GRID_LAYOUT_BY_TIME
    )

    const totalWidthRatio = rawColumnDefs.reduce(
      (acc, cur) => acc + (cur.widthRatio ? cur.widthRatio : 0),
      0
    )

    console.log('total width ratio', totalWidthRatio)
    const columnDefsWithWidth = rawColumnDefs.map(
      ({ widthRatio, minWidth, width, ...col }) => {
        const calculatedWidth = (widthRatio / totalWidthRatio) * width

        console.log('calculatedWidth', calculatedWidth)

        return {
          ...col,
          width:
            calculatedWidth >= (minWidth ? minWidth : 0)
              ? calculatedWidth
              : minWidth,
        }
      }
    )
    console.log(width, columnDefsWithWidth)
    setColumnDefs(columnDefsWithWidth)
  }, [width])
  useEffect(() => {
    const rows = transactions.map(
      ({ name: merchant, account_id, amount, date }) => ({
        merchant,
        account: getCardName({ cards, id: account_id }),
        amount,
        date,
      })
    )

    setRowData(rows)
  }, [selectedTransactions])

  const titleTimeUnit =
    historicalDuration === 'year'
      ? 'Year'
      : historicalDuration === 'month'
      ? 'Month'
      : historicalDuration === 'week'
      ? 'Week'
      : 'Day'

  return (
    <div>
      <div
        className="show-legend"
        onClick={() => resetSelectedTransactionKeyAction()}
      >
        Go back
      </div>

      <h4 style={{ marginTop: 0 }}>
        {`Transactions Looking Back 1 ${titleTimeUnit} From ${startingDate}`}
      </h4>

      <div>
        Income:
        <span className="grid-income-line">
          {numeral(input).format('$0,0.00')}
        </span>
      </div>

      <div>
        Spending:
        <span className="grid-spending-line">
          {numeral(output).format('$0,0.00')}
        </span>
      </div>

      <div className="ag-theme-balham income-spending-grid">
        <AgGridReact columnDefs={columnDefs} rowData={rowData} />
      </div>
    </div>
  )
}
