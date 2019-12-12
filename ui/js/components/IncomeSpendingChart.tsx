/// <reference path="../../../typings/react-vis.d.ts"/>
import React, { Component } from 'react'
import { SetSelectedTransactionActionCreator } from '../actions'
import '../../../node_modules/react-vis/dist/style.css'
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
import { TimeConsolidatedTransactionGroups } from '../reducers'

interface IncomeSpendingChartProps {
  transactionsByDayCountCombined: TimeConsolidatedTransactionGroups
  setSelectedTransactionKeyAction: SetSelectedTransactionActionCreator
  windowWidth: number
}

interface IncomeSpendingChartState {
  currentX: number
  ref: React.RefObject<any>
}

export class IncomeSpendingChart extends Component<
  IncomeSpendingChartProps,
  IncomeSpendingChartState
> {
  constructor(props: IncomeSpendingChartProps) {
    super(props)
    this.state = {
      currentX: 0,
      ref: React.createRef(),
    }
  }

  lineSeriesConverter: () => {
    incomeSeries: Array<{ x: number; y: number }>
    spendingSeries: Array<{ x: number; y: number }>
  } = () => {
    return Object.entries(this.props.transactionsByDayCountCombined).reduce(
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
  }

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
    const { setSelectedTransactionKeyAction, windowWidth } = this.props

    const { incomeSeries, spendingSeries } = this.lineSeriesConverter()
    const { incomeY, spendingY } = this.getCurrentYs()

    return (
      <div ref={this.state.ref}>
        <XYPlot
          height={300}
          width={windowWidth - 330}
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
            color={'#00b44b'}
            data={incomeSeries}
            onNearestX={value => {
              const { currentX } = this.state
              if (currentX !== value.x) {
                this.setState({ currentX: value.x as number })
              }
            }}
          />
          <LineMarkSeries color="#bb0120" data={spendingSeries} />
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
