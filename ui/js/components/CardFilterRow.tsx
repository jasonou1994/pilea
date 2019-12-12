import React, { FunctionComponent } from 'react'

interface Props {
  selected: boolean
  displayName: string
  onCheckboxClick: () => void
  indentLevel: number
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
