import React, { Component } from 'react'
import { formatMilliseconds, formatNumberAsDollars } from '../utilities/utils'

interface CrosshairDisplayProps {
  time: number
  income: number
  spending: number
}

interface CrosshairDisplayState {}

export class CrosshairDisplay extends Component<
  CrosshairDisplayProps,
  CrosshairDisplayState
> {
  render() {
    const { time, income, spending } = this.props
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
}
