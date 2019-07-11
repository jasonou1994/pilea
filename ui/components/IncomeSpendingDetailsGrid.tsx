import React, { Component } from 'react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import { AgGridReact } from 'ag-grid-react'
import { GridColumnDef, getGridColumnDefs } from '../utilities/layout'
import { GRID_LAYOUT_BY_TIME } from '../konstants'
import { PileaCard } from '../sagas/sagas'
import {
  TimeConsolidatedTransactionGroup,
  getCardName,
} from '../reducers/transactionsAccounts'

interface IncomeSpendingDetailsGridProps {
  cards: PileaCard[]
  selectedTransactions: TimeConsolidatedTransactionGroup
}

interface IncomeSpendingDetailsGridState {
  columnDefs: GridColumnDef[]
}
export class IncomeSpendingDetailsGrid extends Component<
  IncomeSpendingDetailsGridProps,
  IncomeSpendingDetailsGridState
> {
  constructor(props) {
    super(props)

    this.state = {
      columnDefs: [],
    }
  }

  componentDidMount() {
    this.setState({ columnDefs: getGridColumnDefs(GRID_LAYOUT_BY_TIME) })
  }

  convertToRowData = () => {
    const {
      cards,
      selectedTransactions: { transactions },
    } = this.props

    return transactions.map(tx => {
      const { name: merchant, account_id, amount, date } = tx

      return {
        merchant,
        account: getCardName({ cards, id: account_id }),
        amount,
        date,
      }
    })
  }

  render() {
    const { columnDefs } = this.state
    const { selectedTransactions } = this.props

    const { input, output } = selectedTransactions
    const rowData = this.convertToRowData()

    return (
      <div>
        <div>Income: {`${input}`}</div>
        <div>Spending: {`${output}`}</div>
        <div
          className="ag-theme-balham"
          style={{
            height: '500px',
          }}
        >
          <AgGridReact columnDefs={columnDefs} rowData={rowData} />
        </div>
      </div>
    )
  }
}
