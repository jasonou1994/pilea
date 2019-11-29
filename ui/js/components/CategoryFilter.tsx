import React, { FunctionComponent, useState, useEffect } from 'react'
import numeral from 'numeral'

import { CategoriesWithTxData } from '../reducers'
import { ToggleCategorySelectedActionCreator } from '../actions'

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
        {rowData.map(({ category, spending, txCount, selected }) => {
          return (
            <div className="category-row">
              <input
                style={{ backgroundColor: 'yellow' }}
                type="checkbox"
                checked={selected}
                onChange={() => {
                  props.toggleCategorySelectedAction({ category })
                }}
              />
              <div className="category-row-items">
                <div className="category-name category-item">{category}</div>
                <div className="category-name category-item">
                  {numeral(spending).format('$0,0')}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
