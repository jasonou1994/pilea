import React, { FunctionComponent, useState, useEffect } from 'react'
import { DailyBalances } from '../reducers/transactionsAccounts'
import {
  XYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  LineMarkSeries,
  Crosshair,
} from 'react-vis'
import moment from 'moment'
import { HistoricalBalanceLineSeries } from '../reducers'
import { HistoricalBalancesCrosshairDisplay } from './HistoricalBalancesCrosshairDisplay'

interface Props {
  historicalBalancesLineSeries: HistoricalBalanceLineSeries
  type: 'combined' | 'individual'
  windowWidth: number
}

export const HistoricalBalancesChart: FunctionComponent<Props> = ({
  historicalBalancesLineSeries,
  type,
  windowWidth,
}) => {
  const [currentX, setCurrentX] = useState(0)
  const [currentYs, setCurrentYs] = useState<{ [cardName: string]: number }>({})

  useEffect(() => {
    const cardNames = Object.keys(historicalBalancesLineSeries)

    setCurrentYs(
      cardNames.reduce((acc, cardName) => {
        const foundMarker = historicalBalancesLineSeries[cardName].find(
          ({ x }) => x === currentX
        )

        return {
          ...acc,
          [cardName]: foundMarker ? foundMarker.y : 0,
        }
      }, {})
    )
  }, [currentX])

  return (
    <XYPlot
      height={330}
      width={windowWidth - 30}
      xType="time"
      margin={{ left: 70, right: 10, top: 10, bottom: 70 }}
      style={{ cursor: 'pointer' }}
    >
      <VerticalGridLines />
      <HorizontalGridLines />
      <XAxis
        tickLabelAngle={315}
        tickFormat={time => moment(time).format('MMM Do, YYYY')}
      />
      <YAxis tickFormat={amount => `$${amount}`} />

      <LineMarkSeries
        color="#bb0120"
        data={historicalBalancesLineSeries.combined}
        onNearestX={value => {
          if (currentX !== value.x) {
            setCurrentX(value.x as number)
          }
        }}
      />
      {Object.entries(historicalBalancesLineSeries).reduce(
        (acc, [cardName, seriesValues]) => {
          if (cardName !== 'combined') {
            acc.push(<LineMarkSeries color="#bb0120" data={seriesValues} />)
          }

          return acc
        },
        []
      )}
      <Crosshair values={[{ x: currentX }]}>
        <HistoricalBalancesCrosshairDisplay
          time={currentX}
          currentYs={currentYs}
        />
      </Crosshair>
    </XYPlot>
  )
}
