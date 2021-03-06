import React, { FunctionComponent, useMemo, useState } from 'react'
import { Crosshair, LineMarkSeries } from 'react-vis'
import { LineSeries } from '../../reducers'
import { HistoricalBalancesCrosshairDisplay } from './HistoricalBalancesCrosshairDisplay'
import { Legend } from './Legend'
import { Plot } from './Plot'
import { LineSeriesMap, useCurrentYs } from './utilities'

interface IndividualPlotProps {
  combinedLineSeries: LineSeries
  height: number
  individualLineSeries: { [cardName: string]: LineSeries }
  width: number
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
  const individualLineSeriesMaps = useMemo(
    () =>
      Object.entries(individualLineSeries).reduce(
        (acc, [cardName, series]) => ({
          ...acc,
          [cardName]: series.reduce(
            (innerAcc, { x, y }) => ({
              ...innerAcc,
              [x]: y,
            }),
            {} as LineSeriesMap
          ),
        }),
        {} as {
          [cardName: string]: LineSeriesMap
        }
      ),
    [individualLineSeries]
  )

  const [currentX, setCurrentX] = useState(0)
  const currentYs = useCurrentYs(individualLineSeriesMaps, currentX)

  const legendItems = useMemo(
    () =>
      Object.keys(individualLineSeries).map((name, i) => ({
        title: name,
        color: colors[i],
      })),
    [individualLineSeries]
  )

  const [showLegend, setShowLegend] = useState<boolean>(true)
  const legendWidth = 150

  return (
    <>
      {!showLegend && (
        <div className="show-legend" onClick={() => setShowLegend(true)}>
          Show legend?
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Plot
          {...{
            width: showLegend ? width - legendWidth : width,
            height: height - 35,
          }}
        >
          <LineMarkSeries
            data={combinedLineSeries}
            onNearestX={value => {
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
        {showLegend && (
          <div
            style={{ width: `${legendWidth}px` }}
            className="legend-container"
          >
            <div className="legend-title-container">
              <span>Legend</span>
              <span
                onClick={() => setShowLegend(false)}
                className="hide-legend"
              >
                Hide?
              </span>
            </div>
            <Legend items={legendItems} />
          </div>
        )}
      </div>
    </>
  )
}
