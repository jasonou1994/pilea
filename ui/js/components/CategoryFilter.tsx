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
import { GridApi, ColumnApi, SelectionChangedEvent } from 'ag-grid-community'
import {
  ResetCategoriesSelectedActionCreator,
  SetCategoriesSelectedActionCreator,
} from '../actions'

interface CategoryFilterProps {
  categoryData: CategoryData
  resetCategoriesSelectedAction: ResetCategoriesSelectedActionCreator
  setCategoriesSelectedAction: SetCategoriesSelectedActionCreator
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
        (a, b) => b[CATEGORY_GRID_FIELD_AMOUNT] - a[CATEGORY_GRID_FIELD_AMOUNT]
      )

  setGridAPIs = ({
    api,
    columnApi,
  }: {
    api: GridApi
    columnApi: ColumnApi
  }) => {
    api.selectAll()

    this.setState({ api, columnApi })
  }

  render() {
    const { api } = this.state
    const {
      resetCategoriesSelectedAction,
      setCategoriesSelectedAction,
    } = this.props

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
              console.log('hi')
              if (api) {
                console.log('here')
                resetCategoriesSelectedAction({})
                api.selectAll()
              }
            }}
            onSelectionChanged={({ api }: SelectionChangedEvent) => {
              const currentSelectedRows = api.getSelectedRows()

              setCategoriesSelectedAction(
                currentSelectedRows.map(
                  catRow => catRow[CATEGORY_GRID_FIELD_CATEGORY]
                )
              )
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
