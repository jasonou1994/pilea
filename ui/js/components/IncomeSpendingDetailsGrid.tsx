import React, { FunctionComponent, useState, useEffect } from 'react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import { AgGridReact } from 'ag-grid-react'

import { PileaCard } from '../sagas/sagas'
import { TimeConsolidatedTransactionGroup } from '../reducers'
import { GridColumnDef, getDataGridColumnDefs } from '../utilities/layout'
import { GRID_LAYOUT_BY_TIME } from '../konstants'
import { getCardName } from '../utilities/utils'

interface IncomeSpendingDetailsGridProps {
  cards: PileaCard[]
  selectedTransactions: TimeConsolidatedTransactionGroup
  windowWidth: number
}

export const IncomeSpendingDetailsGrid: FunctionComponent<IncomeSpendingDetailsGridProps> = ({
  cards,
  selectedTransactions,
  selectedTransactions: { transactions, input, output },
  windowWidth,
}) => {
  const [columnDefs, setColumnDefs] = useState<GridColumnDef[]>([])
  const [rowData, setRowData] = useState([])

  useEffect(() => setColumnDefs(getDataGridColumnDefs(GRID_LAYOUT_BY_TIME)), [])
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
      <div>Income: {`${input}`}</div>
      <div>Spending: {`${output}`}</div>
      <div
        className="ag-theme-balham"
        style={{
          height: '500px',
          width: `${windowWidth - 330}px`,
          margin: '0',
        }}
      >
        <AgGridReact columnDefs={columnDefs} rowData={rowData} />
      </div>
    </div>
  )
}
