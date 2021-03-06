import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import { AgGridReact } from 'ag-grid-react'
import moment from 'moment'
import numeral from 'numeral'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { ResetSelectedTransactionActionCreator } from '../../actions'
import { GRID_LAYOUT_BY_TIME } from '../../konstants'
import { TimeConsolidatedTransactionGroup } from '../../reducers'
import { PileaCard } from '../../sagas/sagas'
import { getDataGridColumnDefs } from '../../utilities/layout'
import { getCardName } from '../../utilities/utils'

interface IncomeSpendingDetailsGridProps {
  cards: PileaCard[]
  historicalDuration: string
  resetSelectedTransactionKeyAction: ResetSelectedTransactionActionCreator
  selectedTransactions: TimeConsolidatedTransactionGroup
  startingDate: number
}

export const IncomeSpendingDetailsGrid: FunctionComponent<IncomeSpendingDetailsGridProps> = ({
  cards,
  selectedTransactions,
  selectedTransactions: { transactions, input, output },
  resetSelectedTransactionKeyAction,
  historicalDuration,
  startingDate,
}) => {
  const [rowData, setRowData] = useState([])

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
      <div
        className="show-legend"
        onClick={() => resetSelectedTransactionKeyAction()}
      >
        Go back
      </div>

      <h4 style={{ marginTop: 0 }}>
        {`Transactions from ${moment(startingDate).format(
          'MMMM Do, YYYY'
        )} to ${moment(startingDate)
          .add(1, historicalDuration as any)
          .format('MMMM Do, YYYY')}`}
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
        <AgGridReact
          columnDefs={getDataGridColumnDefs(GRID_LAYOUT_BY_TIME)}
          rowData={rowData}
        />
      </div>
    </div>
  )
}
