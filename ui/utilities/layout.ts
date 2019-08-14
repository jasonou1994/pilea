import { AvailableGridLayouts, GRID_LAYOUT_BY_TIME } from '../konstants'

export interface GridColumnDef {
  headerName: string
  field: string
  sortable: boolean
  filter: boolean
}

interface GridColumnDefWithShown extends GridColumnDef {
  shown: AvailableGridLayouts[]
}

const dataGridColumnDefs: GridColumnDefWithShown[] = [
  {
    headerName: 'Date',
    field: 'date',
    sortable: true,
    filter: true,
    shown: [GRID_LAYOUT_BY_TIME],
  },
  {
    headerName: 'Account',
    field: 'account',
    sortable: true,
    filter: true,
    shown: [GRID_LAYOUT_BY_TIME],
  },
  {
    headerName: 'Merchant Name',
    field: 'merchant',
    sortable: true,
    filter: true,
    shown: [GRID_LAYOUT_BY_TIME],
  },
  {
    headerName: 'Amount',
    field: 'amount',
    sortable: true,
    filter: true,
    shown: [GRID_LAYOUT_BY_TIME],
  },
]

export const getGridColumnDefs: (
  layout: AvailableGridLayouts
) => GridColumnDef[] = layout =>
  dataGridColumnDefs
    .filter(def => def.shown.includes(layout))
    .map(({ headerName, field, sortable, filter }) => ({
      headerName,
      field,
      sortable,
      filter,
    }))
