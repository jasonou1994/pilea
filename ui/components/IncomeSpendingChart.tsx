/// <reference path="../../typings/react-vis.d.ts"/>
import React, { Component } from 'react'
import { SetSelectedTransactionActionCreator } from '../actions'
import '../../node_modules/react-vis/dist/style.css'
import { isEmpty } from 'lodash'
import moment from 'moment'
import {
  XYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  LineMarkSeries,
  Crosshair,
} from 'react-vis'
import { INPUT, OUTPUT } from '../konstants'
import { CrosshairDisplay } from './CrosshairDisplay'

interface IncomeSpendingChartProps {
  transactionsByDayCountCombined
  transactionsByCategory
  transactionsByName
  setSelectedTransactionKeyAction: SetSelectedTransactionActionCreator
}

interface IncomeSpendingChartState {
  currentX: number
}

export class IncomeSpendingChart extends Component<
  IncomeSpendingChartProps,
  IncomeSpendingChartState
> {
  constructor(props) {
    super(props)
    this.state = {
      currentX: 0,
    }
  }

  lineSeriesConverter: () => {
    incomeSeries: Array<{ x: number; y: number }>
    spendingSeries: Array<{ x: number; y: number }>
  } = () =>
    Object.entries(this.props.transactionsByDayCountCombined).reduce(
      (result, [date, txs]) => {
        const unixMiliStamp = moment(date, 'YYYY-MM-DD', true).valueOf()

        result.incomeSeries.push({
          x: unixMiliStamp,
          y: txs[INPUT],
        })

        result.spendingSeries.push({
          x: unixMiliStamp,
          y: txs[OUTPUT],
        })

        return result
      },
      {
        incomeSeries: [],
        spendingSeries: [],
      }
    )

  getCurrentYs: () => { incomeY: number; spendingY: number } = () => {
    const { transactionsByDayCountCombined: transactions } = this.props
    const { currentX } = this.state

    const key = moment(currentX).format('YYYY-MM-DD')
    if (isEmpty(transactions) || !transactions[key]) {
      return {
        incomeY: 0,
        spendingY: 0,
      }
    }

    return {
      incomeY: transactions[key][INPUT],
      spendingY: transactions[key][OUTPUT],
    }
  }

  render() {
    const { currentX } = this.state
    const { setSelectedTransactionKeyAction } = this.props

    const { incomeSeries, spendingSeries } = this.lineSeriesConverter()
    const { incomeY, spendingY } = this.getCurrentYs()
    // console.log(incomeSeries, spendingSeries, incomeY, spendingY)
    return (
      <div>
        <div style={{ fontSize: '18px' }}>Transactions by Time</div>
        <XYPlot
          height={300}
          width={600}
          xType="time"
          margin={{ left: 70, right: 10, top: 10, bottom: 70 }}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setSelectedTransactionKeyAction(
              moment(currentX).format('YYYY-MM-DD')
            )
          }}
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis
            tickLabelAngle={315}
            tickFormat={time => moment(time).format('MMM Do, YYYY')}
          />
          <YAxis tickFormat={amount => `$${amount}`} />
          <LineMarkSeries
            data={incomeSeries}
            onNearestX={value => {
              const { currentX } = this.state
              if (currentX !== value.x) {
                this.setState({ currentX: value.x as number })
              }
            }}
          />
          <LineMarkSeries data={spendingSeries} />
          <Crosshair values={[{ x: currentX }]}>
            <CrosshairDisplay
              time={currentX}
              income={incomeY}
              spending={spendingY}
            />
          </Crosshair>
        </XYPlot>
      </div>
    )
  }
}
