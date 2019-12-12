/// <reference path="../../../typings/react-vis.d.ts"/>

import React, { FunctionComponent, useState, useEffect } from 'react'
import '../../../node_modules/react-vis/dist/style.css'
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
import { CrosshairDisplay } from './CrosshairDisplay'
import { GraphLineSeries } from '../reducers'

interface IncomeSpendingChartProps {
  lineSeries: GraphLineSeries
  setSelectedTransactionKeyAction: SetSelectedTransactionActionCreator
  windowWidth: number
}

export const IncomeSpendingChart: FunctionComponent<IncomeSpendingChartProps> = ({
  setSelectedTransactionKeyAction,
  windowWidth,
  lineSeries: { incomeSeries, spendingSeries },
}) => {
  const [currentX, setCurrentX] = useState(0)
  const [currentYs, setCurrentYs] = useState({ incomeY: 0, spendingY: 0 })

  useEffect(() => {
    const incomeY = incomeSeries.reduce(
      (acc, cur) => (cur.x === currentX ? cur.y : acc),
      0
    )
    const spendingY = spendingSeries.reduce(
      (acc, cur) => (cur.x === currentX ? cur.y : acc),
      0
    )

    setCurrentYs({ incomeY, spendingY })
  }, [currentX])

  const { incomeY, spendingY } = currentYs

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
