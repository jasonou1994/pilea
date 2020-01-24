import React from 'react'
import { AgGridColumnProps } from 'ag-grid-react'
import numeral from 'numeral'
import { AvailableGridLayouts, GRID_LAYOUT_BY_TIME } from '../konstants'

export interface GridColumnDef extends AgGridColumnProps {}

interface GridColumnDefWithShown extends GridColumnDef {
  shown: AvailableGridLayouts[]
}

const dataGridColumnDefs: GridColumnDefWithShown[] = [
  {
    headerName: 'Date',
    field: 'date',
    sort: 'desc',
    sortable: true,
    filter: true,
    resizable: false,
    minWidth: 100,
    width: 100,
    shown: [GRID_LAYOUT_BY_TIME],
  },
  {
    headerName: 'Account',
    field: 'account',
    sortable: true,
    filter: true,
    resizable: false,
    shown: [GRID_LAYOUT_BY_TIME],
    minWidth: 100,
    flex: 1.75,
  },
  {
    headerName: 'Merchant Name',
    field: 'merchant',
    sortable: true,
    filter: true,
    resizable: false,
    shown: [GRID_LAYOUT_BY_TIME],
    minWidth: 100,
    flex: 1.5,
  },
  {
    headerName: 'Amount',
    field: 'amount',
    sortable: true,
    filter: true,
    resizable: false,
    shown: [GRID_LAYOUT_BY_TIME],
    minWidth: 100,
    flex: 1,

    cellStyle: { display: 'flex', 'justify-content': 'flex-end' },
    cellRenderer: colData => {
      const positive = Number(colData.data.amount) >= 0
      const formattedValue = numeral(
        Math.abs(Number(colData.data.amount))
      ).format('$0,0.00')
      return `<span class=${
        positive ? 'grid-spending-line' : 'grid-income-line'
      }>${formattedValue}</span>`
    },
  },
]

export const getDataGridColumnDefs: (
  layout: AvailableGridLayouts
) => GridColumnDef[] = layout =>
  dataGridColumnDefs
    .filter(def => def.shown.includes(layout))
    .map(({ shown, ...def }) => ({ ...def }))
