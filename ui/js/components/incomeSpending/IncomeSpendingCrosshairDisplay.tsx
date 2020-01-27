import classNames from 'classnames'
import React, { FunctionComponent } from 'react'
import {
  formatMilliseconds,
  formatNumberAsDollars,
} from '../../utilities/utils'

interface CrosshairDisplayProps {
  income: number
  spending: number
  time: number
}

export const IncomeSpendingCrosshairDisplay: FunctionComponent<CrosshairDisplayProps> = props => {
  const { time, income, spending } = props
  return (
    <div className="historical-balances-crosshair" style={{ width: '175px' }}>
      <h4 style={{ marginTop: '0px' }}>{formatMilliseconds(time)}</h4>
      <div className="row">
        <span>Income:</span>
        <span
          className={classNames({
            positive: true,
            amount: true,
          })}
        >
          {formatNumberAsDollars(Number(income))}
        </span>
      </div>

      <div className="row">
        <span>Spending:</span>
        <span
          className={classNames({
            negative: true,
            amount: true,
          })}
        >
          {formatNumberAsDollars(Number(spending))}
        </span>
      </div>
    </div>
  )
}
