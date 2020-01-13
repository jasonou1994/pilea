import React, { FunctionComponent } from 'react'

interface LegendProps {
  items: Array<{
    title: string
    color: string
  }>
}

export const Legend: FunctionComponent<LegendProps> = ({ items }) => {
  return (
    <div className="legend">
      {items.map(item => (
        <div className="legend-row">
          <div
            className="legend-color"
            style={{ backgroundColor: item.color }}
          ></div>
          <span className="legend-title">{item.title}</span>
        </div>
      ))}
    </div>
  )
}
