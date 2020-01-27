import React, { FunctionComponent, useEffect, useState } from 'react'

import {
  SelectAllCategoriesActionCreator,
  SelectSingleCategoryActionCreator,
  ToggleCategorySelectedActionCreator,
} from '../actions'
import { CategoriesWithTxData } from '../reducers'
import { CategoryFilterRow } from './CategoryFilterRow'

interface CategoryFilterProps {
  categoryData: CategoriesWithTxData
  selectAllCategoriesAction: SelectAllCategoriesActionCreator
  selectSingleCategoryAction: SelectSingleCategoryActionCreator
  toggleCategorySelectedAction: ToggleCategorySelectedActionCreator
}

type CategoryRowData = Array<{
  category: string
  selected: boolean
  spending: number
  txCount: number
}>

export const CategoryFilter: FunctionComponent<CategoryFilterProps> = props => {
  const [rowData, setRowData] = useState<CategoryRowData>([])

  useEffect(
    () =>
      setRowData(
        Object.entries(props.categoryData)
          .filter(([_, { spending }]) => spending > 0)
          .map(([category, { spending, txCount, selected }]) => ({
            category,
            selected,
            txCount,
            spending,
          }))
          .sort((a, b) => b.spending - a.spending)
      ),
    [props.categoryData]
  )

  return (
    <>
      <h4>Categories</h4>
      <div
        onClick={() => props.selectAllCategoriesAction({})}
        style={{
          marginTop: '-8px',
          marginBottom: '8px',
          fontSize: '12px',
          cursor: 'pointer',
        }}
      >
        Select All Categories
      </div>
      <div className="category-table">
        {rowData.map(({ category, spending, selected }, i) => {
          return (
            <CategoryFilterRow
              {...{
                key: i,
                selected,
                category,
                spending,
                toggleSelected: (category: string) =>
                  props.toggleCategorySelectedAction({ category }),
                selectSingleCategory: (category: string) =>
                  props.selectSingleCategoryAction({ category }),
              }}
            />
          )
        })}
      </div>
    </>
  )
}
