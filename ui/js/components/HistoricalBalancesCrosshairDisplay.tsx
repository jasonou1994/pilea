import React, { Component, FunctionComponent } from 'react'
import { formatMilliseconds, formatNumberAsDollars } from '../utilities/utils'

interface CrosshairDisplayProps {
  time: number
  currentYs: { [cardName: string]: number }
}

export const HistoricalBalancesCrosshairDisplay: FunctionComponent<CrosshairDisplayProps> = props => {
  const { time, currentYs } = props
  return (
    <div
      style={{
        borderRadius: '3px',
        backgroundColor: 'black',
        padding: '3px',
        width: '300px',
      }}
    >
      <h4>{formatMilliseconds(time)}</h4>
      {Object.entries(currentYs).map(([cardname, amount]) => (
        <div>
          {cardname}: {formatNumberAsDollars(Number(amount))}
        </div>
      ))}
    </div>
  )
}
