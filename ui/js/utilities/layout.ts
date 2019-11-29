import numeral from 'numeral'
import { AvailableGridLayouts, GRID_LAYOUT_BY_TIME } from '../konstants'

export interface GridColumnDef {
  headerName: string
  field: string
  sortable: boolean
  filter: boolean
  checkboxSelection?: boolean
  resizable: boolean
  width?: number
  sort?: 'asc' | 'desc'
  valueGetter?: any
  cellStyle?: any
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
    width: 100,
    resizable: false,
    shown: [GRID_LAYOUT_BY_TIME],
  },
  {
    headerName: 'Account',
    field: 'account',
    sortable: true,
    filter: true,
    resizable: true,
    width: 250,
    shown: [GRID_LAYOUT_BY_TIME],
  },
  {
    headerName: 'Merchant Name',
    field: 'merchant',
    sortable: true,
    filter: true,
    resizable: true,
    width: 300,
    shown: [GRID_LAYOUT_BY_TIME],
  },
  {
    headerName: 'Amount',
    field: 'amount',
    sortable: true,
    filter: true,
    resizable: true,
    width: 100,
    shown: [GRID_LAYOUT_BY_TIME],

    cellStyle: { display: 'flex', 'justify-content': 'flex-end' },
    valueGetter: (colData: any) => {
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
