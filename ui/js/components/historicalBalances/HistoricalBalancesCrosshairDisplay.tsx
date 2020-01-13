import React, { FunctionComponent } from 'react'
import {
  formatMilliseconds,
  formatNumberAsDollars,
} from '../../utilities/utils'
import { CurrentYs } from './utilities'
import classNames from 'classnames'

interface CrosshairDisplayProps {
  time: number
  currentYs: CurrentYs
}

export const HistoricalBalancesCrosshairDisplay: FunctionComponent<CrosshairDisplayProps> = props => {
  const { time, currentYs } = props
  return (
    <div className="historical-balances-crosshair">
      <h4 style={{ marginTop: '0px' }}>{formatMilliseconds(time)}</h4>
      {Object.entries(currentYs)
        .sort(([_, amountA], [__, amountB]) => amountB - amountA)
        .map(([cardname, amount], i) => (
          <div key={i} className="row">
            <span>{cardname}:</span>
            <span
              className={classNames({
                positive: Number(amount) >= 0,
                negative: Number(amount) < 0,
                amount: true,
              })}
            >
              {formatNumberAsDollars(Number(amount))}
            </span>
          </div>
        ))}
    </div>
  )
}
