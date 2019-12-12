import React, { FunctionComponent, useState, useEffect } from 'react'

import { CategoriesWithTxData } from '../reducers'
import { ToggleCategorySelectedActionCreator } from '../actions'
import { CategoryFilterRow } from './CategoryFilterRow'

interface CategoryFilterProps {
  categoryData: CategoriesWithTxData
  toggleCategorySelectedAction: ToggleCategorySelectedActionCreator
}

type CategoryRowData = Array<{
  category: string
  selected: boolean
  txCount: number
  spending: number
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
      <div className="category-table">
        {rowData.map(({ category, spending, txCount, selected }, i) => {
          return (
            <CategoryFilterRow
              {...{
                selected,
                category,
                spending,
                toggleSelected: (category: string) =>
                  props.toggleCategorySelectedAction({ category }),
              }}
            />
          )
        })}
      </div>
    </>
  )
}
