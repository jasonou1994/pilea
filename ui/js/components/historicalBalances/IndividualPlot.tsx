import React, { FunctionComponent, useState } from 'react'
import { LineSeries } from '../../reducers'
import { LineMarkSeries, Crosshair } from 'react-vis'
import { HistoricalBalancesCrosshairDisplay } from './HistoricalBalancesCrosshairDisplay'
import { useLineSeriesMap, useCurrentYs, LineSeriesMap } from './utilities'
import { Plot } from './Plot'

interface IndividualPlotProps {
  combinedLineSeries: LineSeries
  individualLineSeries: { [cardName: string]: LineSeries }
  width: number
  height: number
}

const colors = [
  '#447c69',
  '#74c493',
  '#e4bf80',
  '#e9d78e',
  '#e2975d',
  '#f19670',
  '#e16552',
  '#c94a53',
  '#be5168',
  '#a34974',
  '#993767',
  '#65387d',
  '#4e2472',
  '#9163b6',
  '#e279a3',
  '#e0598b',
  '#7c9fb0',
  '#5698c4',
  '#9abf88',
]

export const IndividualPlot: FunctionComponent<IndividualPlotProps> = ({
  combinedLineSeries,
  individualLineSeries,
  width,
  height,
}) => {
  const individualLineSeriesMaps = Object.entries(individualLineSeries).reduce(
    (acc, [cardName, lineSeries]) => ({
      ...acc,
      [cardName]: useLineSeriesMap(lineSeries),
    }),
    {} as { [cardName: string]: LineSeriesMap }
  )

  const [currentX, setCurrentX] = useState(0)
  const currentYs = useCurrentYs(individualLineSeriesMaps, currentX)

  return (
    <Plot {...{ width, height }}>
      <LineMarkSeries
        data={combinedLineSeries}
        onNearestX={value => {
          console.log('hi')
          if (currentX !== value.x) {
            setCurrentX(value.x as number)
          }
        }}
        style={{ opacity: 0 }}
      />

      {Object.values(individualLineSeries).map((lineSeries, i) => (
        <LineMarkSeries
          data={lineSeries}
          key={i}
          curve="curveMonotoneX"
          color={colors[i]}
        />
      ))}

      <Crosshair values={[{ x: currentX }]}>
        <HistoricalBalancesCrosshairDisplay
          time={currentX}
          currentYs={currentYs}
        />
      </Crosshair>
    </Plot>
  )
}
