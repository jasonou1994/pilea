import React, { Component } from 'react'

interface Props {
  selected: boolean
  displayName: string
  onCheckboxClick: () => void
  indentLevel: number
}

export class FilterRow extends Component<Props> {
  render = () => {
    const { selected, displayName, onCheckboxClick, indentLevel } = this.props

    return (
      <div>
        <span>
          {Array(indentLevel)
            .fill(null)
            .map((_, i) => (
              <span key={i} style={{ opacity: 0 }}>
                ---
              </span>
            ))}

          <input
            type="checkbox"
            checked={selected}
            onChange={onCheckboxClick}
          />
          {displayName}
        </span>
      </div>
    )
  }
}
