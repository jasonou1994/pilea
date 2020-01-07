import React, { FunctionComponent, useState, useEffect } from 'react'
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
import { AvailableHistoricalGraphTypes } from '../reducers/graph'

interface Props {
  historicalBalancesLineSeries: HistoricalBalanceLineSeries
  type: AvailableHistoricalGraphTypes
  windowWidth: number
}

export const HistoricalBalancesChart: FunctionComponent<Props> = ({
  historicalBalancesLineSeries,
  type,
  windowWidth,
}) => {
  const [currentX, setCurrentX] = useState(0)
  const [currentYs, setCurrentYs] = useState<{ [cardName: string]: number }>({})

  const [balancesMap, setBalancesMap] = useState<{
    [series: string]: { [x: number]: number }
  }>({})
  useEffect(() => {
    setBalancesMap(
      Object.entries(historicalBalancesLineSeries).reduce(
        (acc, [cardName, valuesArr]) => {
          acc[cardName] = valuesArr.reduce(
            (innerAcc, { x, y }) => ({
              ...innerAcc,
              [x]: y,
            }),
            {}
          )

          return acc
        },
        {} as {
          [series: string]: { [x: number]: number }
        }
      )
    )
  }, [historicalBalancesLineSeries])

  useEffect(() => {
    setCurrentYs(
      Object.entries(balancesMap).reduce((acc, [cardName, valuesMap]) => {
        const foundMarker = valuesMap[currentX]

        if (foundMarker) {
          acc[cardName] = foundMarker
        }

        return acc
      }, {} as { [cardName: string]: number })
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

      {type === 'combined' ? (
        <LineMarkSeries
          color="#bb0120"
          data={historicalBalancesLineSeries.combined}
          onNearestX={value => {
            if (currentX !== value.x) {
              setCurrentX(value.x as number)
            }
          }}
        />
      ) : type === 'individual' ? (
        Object.entries(historicalBalancesLineSeries).reduce(
          (acc, [cardName, seriesValues], i) => {
            if (cardName !== 'combined') {
              acc.push(
                <LineMarkSeries
                  {...{
                    data: seriesValues,
                    key: i,
                    onNearestX:
                      i === 1
                        ? value => {
                            if (currentX !== value.x) {
                              setCurrentX(value.x as number)
                            }
                          }
                        : undefined,
                  }}
                />
              )
            }

            return acc
          },
          []
        )
      ) : null}

      <Crosshair values={[{ x: currentX }]}>
        <HistoricalBalancesCrosshairDisplay
          time={currentX}
          currentYs={currentYs}
        />
      </Crosshair>
    </XYPlot>
  )
}
