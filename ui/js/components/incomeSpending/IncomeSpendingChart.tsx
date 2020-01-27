import moment from 'moment'
import React, { FunctionComponent, useEffect, useState } from 'react'
import {
  Crosshair,
  HorizontalGridLines,
  LineMarkSeries,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
} from 'react-vis'
import '../../../../node_modules/react-vis/dist/style.css'

import { SetSelectedTransactionActionCreator } from '../../actions'
import { GraphLineSeries } from '../../reducers'
import { useHover } from '../../utilities/hooks'
import { IncomeSpendingCrosshairDisplay } from './IncomeSpendingCrosshairDisplay'

interface IncomeSpendingChartProps {
  height: number
  lineSeries: GraphLineSeries
  setSelectedTransactionKeyAction: SetSelectedTransactionActionCreator
  width: number
}

export const IncomeSpendingChart: FunctionComponent<IncomeSpendingChartProps> = ({
  setSelectedTransactionKeyAction,
  width,
  height,
  lineSeries: { incomeSeries, spendingSeries },
}) => {
  const [hoverRef, isHovered] = useHover()
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
    <div ref={hoverRef as React.MutableRefObject<any>}>
      <XYPlot
        height={height}
        width={width}
        xType="time"
        margin={{ left: 50, right: 10, top: 20, bottom: 70 }}
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
          curve={'curveMonotoneX'}
        />
        <LineMarkSeries
          color="#bb0120"
          data={spendingSeries}
          curve={'curveMonotoneX'}
        />
        {isHovered && (
          <Crosshair values={[{ x: currentX }]}>
            <IncomeSpendingCrosshairDisplay
              time={currentX}
              income={incomeY}
              spending={spendingY}
            />
          </Crosshair>
        )}
      </XYPlot>
    </div>
  )
}
