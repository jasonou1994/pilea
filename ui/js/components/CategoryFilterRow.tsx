import numeral from 'numeral'
import React, { FunctionComponent } from 'react'

interface CategoryFilterRowProps {
  category: string
  selected: boolean
  selectSingleCategory: (category: string) => void
  spending: number
  toggleSelected: (category: string) => void
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
