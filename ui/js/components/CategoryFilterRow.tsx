import React, { FunctionComponent } from 'react'
import numeral from 'numeral'

interface CategoryFilterRowProps {
  selected: boolean
  toggleSelected: (category: string) => void
  selectSingleCategory: (category: string) => void
  category: string
  spending: number
}

export const CategoryFilterRow: FunctionComponent<CategoryFilterRowProps> = ({
  selected,
  toggleSelected,
  category,
  spending,
  selectSingleCategory,
}) => {
  return (
    <div>
      <div className="category-row">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => {
            toggleSelected(category)
          }}
        />

        <div className="category-row-items">
          <div className="category-name category-item">{category}</div>
          <div className="category-name category-item">
            {numeral(spending).format('$0,0')}
          </div>
        </div>
      </div>
      <div
        onClick={() => selectSingleCategory(category)}
        className="category-row-show-only"
      >
        (Show only)
      </div>
    </div>
  )
}