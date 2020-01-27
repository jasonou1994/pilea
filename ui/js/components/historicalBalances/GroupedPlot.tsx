import React, { FunctionComponent, useState } from 'react'
import { Crosshair, LineMarkSeries } from 'react-vis'
import { LineSeries } from '../../reducers'
import { HistoricalBalancesCrosshairDisplay } from './HistoricalBalancesCrosshairDisplay'
import { Plot } from './Plot'
import { useCurrentYs, useLineSeriesMap } from './utilities'

interface GroupedPlotProps {
  assetLineSeries: LineSeries
  height: number
  liabilityLineSeries: LineSeries
  width: number
}

export const GroupedPlot: FunctionComponent<GroupedPlotProps> = ({
  assetLineSeries,
  liabilityLineSeries,
  width,
  height,
}) => {
  const assetLineSeriesMap = useLineSeriesMap(assetLineSeries)
  const liabilitiesLineSeriesMap = useLineSeriesMap(liabilityLineSeries)

  const [currentX, setCurrentX] = useState(0)
  const currentYs = useCurrentYs(
    { Assets: assetLineSeriesMap, Liabilities: liabilitiesLineSeriesMap },
    currentX
  )

  return (
    <Plot {...{ width, height }}>
      <LineMarkSeries
        color="#00b44b"
        data={assetLineSeries}
        onNearestX={value => {
          if (currentX !== value.x) {
            setCurrentX(value.x as number)
          }
        }}
        curve={'curveMonotoneX'}
      />
      <LineMarkSeries
        color="#bb0120"
        data={liabilityLineSeries}
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
