import React, { FunctionComponent } from 'react'
import {
  formatMilliseconds,
  formatNumberAsDollars,
} from '../../utilities/utils'

interface CrosshairDisplayProps {
  time: number
  income: number
  spending: number
}

export const IncomeSpendingCrosshairDisplay: FunctionComponent<CrosshairDisplayProps> = props => {
  const { time, income, spending } = props
  return (
    <div
      style={{
        borderRadius: '3px',
        backgroundColor: 'black',
        padding: '3px',
        width: '100px',
      }}
    >
      <h4>{formatMilliseconds(time)}</h4>
      <div>Income: {formatNumberAsDollars(Number(income))}</div>
      <div>Spending: {formatNumberAsDollars(Number(spending))}</div>
    </div>
  )
}
