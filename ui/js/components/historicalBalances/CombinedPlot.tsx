import React, { FunctionComponent, useState } from 'react'
import { LineSeries } from '../../reducers'
import { LineMarkSeries, Crosshair } from 'react-vis'
import { HistoricalBalancesCrosshairDisplay } from './HistoricalBalancesCrosshairDisplay'
import { useLineSeriesMap, useCurrentYs } from './utilities'
import { Plot } from './Plot'

interface CombinedPlotProps {
  combinedLineSeries: LineSeries
  width: number
  height: number
}

export const CombinedPlot: FunctionComponent<CombinedPlotProps> = ({
  combinedLineSeries,
  width,
  height,
}) => {
  const combinedLineSeriesMap = useLineSeriesMap(combinedLineSeries)

  const [currentX, setCurrentX] = useState(0)
  const currentYs = useCurrentYs({ Combined: combinedLineSeriesMap }, currentX)

  return (
    <Plot {...{ width, height }}>
      <LineMarkSeries
        color="#00B7E4"
        data={combinedLineSeries}
        onNearestX={value => {
          if (currentX !== value.x) {
            setCurrentX(value.x as number)
          }
        }}
        curve={'curveMonotoneX'}
      />
      <Crosshair values={[{ x: currentX }]}>
        <HistoricalBalancesCrosshairDisplay
          time={currentX}
          currentYs={currentYs}
        />
      </Crosshair>
    </Plot>
  )
}
