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
        <input type="checkbox" checked={selected} onClick={onCheckboxClick} />
        <span>{displayName}</span>
      </div>
    )
  }
}
