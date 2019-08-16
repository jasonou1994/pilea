import React, { Component } from 'react'
import { CategoryData } from '../reducers'
import {
  CATEGORY_GRID_FIELD_INCLUDED,
  CATEGORY_GRID_FIELD_CATEGORY,
  CATEGORY_GRID_FIELD_TX_COUNT,
  CATEGORY_GRID_FIELD_AMOUNT,
} from '../konstants'
import { AgGridReact } from 'ag-grid-react/lib/agGridReact'
import { categoryGridColDefs } from '../utilities/layout'
import { GridApi, ColumnApi } from 'ag-grid-community'

interface CategoryFilterProps {
  categoryData: CategoryData
}

interface CategoryFilterState {
  api?: GridApi
  columnApi?: ColumnApi
}

export class CategoryFilter extends Component<
  CategoryFilterProps,
  CategoryFilterState
> {
  constructor(props: CategoryFilterProps) {
    super(props)

    this.state = {}
  }

  convertToRowData = () =>
    Object.entries(this.props.categoryData)
      .map(([categoryName, { spending, txCount }]) => ({
        [CATEGORY_GRID_FIELD_CATEGORY]: categoryName,
        [CATEGORY_GRID_FIELD_TX_COUNT]: txCount,
        [CATEGORY_GRID_FIELD_AMOUNT]: spending,
      }))
      .sort(
        (a, b) => a[CATEGORY_GRID_FIELD_AMOUNT] - b[CATEGORY_GRID_FIELD_AMOUNT]
      )

  setGridAPIs = ({
    api,
    columnApi,
  }: {
    api: GridApi
    columnApi: ColumnApi
  }) => {
    this.setState({ api, columnApi })
  }

  render() {
    const { api, columnApi } = this.state

    return (
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        <div
          className="ag-theme-balham"
          style={{
            height: '250px',
          }}
        >
          <AgGridReact
            onGridReady={this.setGridAPIs}
            onModelUpdated={() => {
              if (api) {
                api.selectAll()
              }
            }}
            rowSelection="multiple"
            rowMultiSelectWithClick={true}
            columnDefs={categoryGridColDefs}
            rowData={this.convertToRowData()}
          />
        </div>
      </div>
    )
  }
}
