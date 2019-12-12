/// <reference path="../../../typings/react-vis.d.ts"/>

import React, { FunctionComponent, useState } from 'react'
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

import { SetSelectedTransactionActionCreator } from '../actions'
import { INPUT, OUTPUT } from '../konstants'
import { CrosshairDisplay } from './CrosshairDisplay'
import { TimeConsolidatedTransactionGroups, GraphLineSeries } from '../reducers'

interface IncomeSpendingChartProps {
  transactionTimeGroups: TimeConsolidatedTransactionGroups
  lineSeries: GraphLineSeries
  setSelectedTransactionKeyAction: SetSelectedTransactionActionCreator
  windowWidth: number
}

export const IncomeSpendingChart: FunctionComponent<IncomeSpendingChartProps> = ({
  transactionTimeGroups,
  setSelectedTransactionKeyAction,
  windowWidth,
  lineSeries: { incomeSeries, spendingSeries },
}) => {
  const [currentX, setCurrentX] = useState(0)

  const getCurrentYs: () => { incomeY: number; spendingY: number } = () => {
    const key = moment(currentX).format('YYYY-MM-DD')
    if (isEmpty(transactionTimeGroups) || !transactionTimeGroups[key]) {
      return {
        incomeY: 0,
        spendingY: 0,
      }
    }

    return {
      incomeY: transactionTimeGroups[key][INPUT],
      spendingY: transactionTimeGroups[key][OUTPUT],
    }
  }

  const { incomeY, spendingY } = getCurrentYs()

  return (
    <XYPlot
      height={300}
      width={windowWidth - 330}
      xType="time"
      margin={{ left: 70, right: 10, top: 10, bottom: 70 }}
      style={{ cursor: 'pointer' }}
      onClick={() => {
        setSelectedTransactionKeyAction(moment(currentX).format('YYYY-MM-DD'))
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
          if (currentX !== value.x) {
            setCurrentX(value.x as number)
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
  )
}
