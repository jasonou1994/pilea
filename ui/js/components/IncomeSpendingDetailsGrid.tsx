import React, { FunctionComponent, useState, useEffect } from 'react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import { AgGridReact } from 'ag-grid-react'
import numeral from 'numeral'

import { PileaCard } from '../sagas/sagas'
import { TimeConsolidatedTransactionGroup } from '../reducers'
import { GridColumnDef, getDataGridColumnDefs } from '../utilities/layout'
import { GRID_LAYOUT_BY_TIME } from '../konstants'
import { getCardName } from '../utilities/utils'

interface IncomeSpendingDetailsGridProps {
  cards: PileaCard[]
  selectedTransactions: TimeConsolidatedTransactionGroup
  allowedWidth: number
}

export const IncomeSpendingDetailsGrid: FunctionComponent<IncomeSpendingDetailsGridProps> = ({
  cards,
  selectedTransactions,
  selectedTransactions: { transactions, input, output },
  allowedWidth,
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

    const columnDefsWithWidth = rawColumnDefs.map(
      ({ widthRatio, minWidth, width, ...col }) => {
        const calculatedWidth = (widthRatio / totalWidthRatio) * allowedWidth

        return {
          ...col,
          width:
            calculatedWidth >= (minWidth ? minWidth : 0)
              ? calculatedWidth
              : minWidth,
        }
      }
    )

    setColumnDefs(columnDefsWithWidth)
  }, [allowedWidth])
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

  return (
    <div>
      <h2>Transactions</h2>
      <div>Income: {numeral(input).format('$0,0.00')}</div>
      <div>Spending: {numeral(output).format('$0,0.00')}</div>
      <div
        className="ag-theme-balham"
        style={{
          height: '500px',
          width: `${allowedWidth}px`,
          margin: '0',
          marginTop: '10px',
        }}
      >
        <AgGridReact columnDefs={columnDefs} rowData={rowData} />
      </div>
    </div>
  )
}
