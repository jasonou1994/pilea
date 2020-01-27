import React, { FunctionComponent } from 'react'

interface Props {
  displayName: string
  indentLevel: number
  onCheckboxClick: () => void
  selected: boolean
}

export const CardFilterRow: FunctionComponent<Props> = props => {
  const { selected, displayName, onCheckboxClick, indentLevel } = props

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

        <input type="checkbox" checked={selected} onChange={onCheckboxClick} />
        {displayName}
      </span>
    </div>
  )
}
