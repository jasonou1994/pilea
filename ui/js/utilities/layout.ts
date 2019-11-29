import numeral from 'numeral'
import { AvailableGridLayouts, GRID_LAYOUT_BY_TIME } from '../konstants'
import { AgGridColumnProps } from 'ag-grid-react'

export interface GridColumnDef extends AgGridColumnProps {
  widthRatio?: number
}

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
    widthRatio: 1,
    resizable: false,
    // minWidth: 100,
    shown: [GRID_LAYOUT_BY_TIME],
  },
  {
    headerName: 'Account',
    field: 'account',
    sortable: true,
    filter: true,
    resizable: true,
    widthRatio: 2.5,
    shown: [GRID_LAYOUT_BY_TIME],
  },
  {
    headerName: 'Merchant Name',
    field: 'merchant',
    sortable: true,
    filter: true,
    resizable: true,
    widthRatio: 3,
    shown: [GRID_LAYOUT_BY_TIME],
  },
  {
    headerName: 'Amount',
    field: 'amount',
    sortable: true,
    filter: true,
    resizable: true,
    widthRatio: 1,
    shown: [GRID_LAYOUT_BY_TIME],

    cellStyle: { display: 'flex', 'justify-content': 'flex-end' },
    valueGetter: colData => {
      return numeral(colData.data.amount).format('$0,0.00')
    },
  },
]

export const getDataGridColumnDefs: (
  layout: AvailableGridLayouts
) => GridColumnDef[] = layout =>
  dataGridColumnDefs
    .filter(def => def.shown.includes(layout))
    .map(({ shown, ...def }) => ({ ...def }))
