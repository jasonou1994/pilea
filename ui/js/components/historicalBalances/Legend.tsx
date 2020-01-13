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
      {items.map((item, i) => (
        <div className="legend-row" key={i}>
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
