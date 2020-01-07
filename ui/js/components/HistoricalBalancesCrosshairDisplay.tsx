import React, { FunctionComponent } from 'react'
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
        width: '200px',
      }}
    >
      <h4>{formatMilliseconds(time)}</h4>
      {Object.entries(currentYs)
        .sort(([_, amountA], [__, amountB]) => amountB - amountA)
        .map(([cardname, amount], i) => (
          <div key={i}>
            {cardname}: {formatNumberAsDollars(Number(amount))}
          </div>
        ))}
    </div>
  )
}
