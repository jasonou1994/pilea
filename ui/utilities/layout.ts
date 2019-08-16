import {
  AvailableGridLayouts,
  GRID_LAYOUT_BY_TIME,
  CATEGORY_GRID_HEADER_INCLUDED,
  CATEGORY_GRID_FIELD_INCLUDED,
  CATEGORY_GRID_HEADER_CATEGORY,
  CATEGORY_GRID_FIELD_CATEGORY,
  CATEGORY_GRID_HEADER_TX_COUNT,
  CATEGORY_GRID_FIELD_TX_COUNT,
  CATEGORY_GRID_HEADER_AMOUNT,
  CATEGORY_GRID_FIELD_AMOUNT,
} from '../konstants'

export interface GridColumnDef {
  headerName: string
  field: string
  sortable: boolean
  filter: boolean
  checkboxSelection?: boolean
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

export const getDataGridColumnDefs: (
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

export const categoryGridColDefs: GridColumnDef[] = [
  {
    headerName: CATEGORY_GRID_HEADER_INCLUDED,
    field: CATEGORY_GRID_FIELD_INCLUDED,
    checkboxSelection: true,
    sortable: true,
    filter: true,
  },
  {
    headerName: CATEGORY_GRID_HEADER_CATEGORY,
    field: CATEGORY_GRID_FIELD_CATEGORY,
    sortable: true,
    filter: true,
  },
  {
    headerName: CATEGORY_GRID_HEADER_TX_COUNT,
    field: CATEGORY_GRID_FIELD_TX_COUNT,
    sortable: true,
    filter: true,
  },
  {
    headerName: CATEGORY_GRID_HEADER_AMOUNT,
    field: CATEGORY_GRID_FIELD_AMOUNT,
    sortable: true,
    filter: true,
  },
]
