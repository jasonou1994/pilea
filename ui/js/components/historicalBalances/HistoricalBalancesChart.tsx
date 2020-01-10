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
import { HistoricalBalanceLineSeries } from '../../reducers'
import { HistoricalBalancesCrosshairDisplay } from './HistoricalBalancesCrosshairDisplay'
import { AvailableHistoricalGraphTypes } from '../../reducers/graph'
import { useHover } from '../../utilities/hooks'
import { CombinedPlot } from './CombinedPlot'
import { GroupedPlot } from './GroupedPlot'

interface Props {
  historicalBalancesLineSeries: HistoricalBalanceLineSeries
  type: AvailableHistoricalGraphTypes
  windowWidth: number
  windowHeight: number
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

export const HistoricalBalancesChart: FunctionComponent<Props> = ({
  historicalBalancesLineSeries,
  type,
  windowWidth,
  windowHeight,
}) => {
  const [hoverRef, isHovered] = useHover()

  const [currentX, setCurrentX] = useState(0)
  const [currentYs, setCurrentYs] = useState<{ [cardName: string]: number }>({})
  const balancesMap = useBalancesMap(historicalBalancesLineSeries)

  useEffect(() => {
    setCurrentYs(
      Object.entries(balancesMap).reduce((acc, [cardName, valuesMap]) => {
        // Do some filtering
        if (type === 'combined' && cardName !== 'Combined') {
          return acc
        } else if (
          type === 'individual' &&
          (cardName === 'Combined' ||
            cardName === 'Assets' ||
            cardName === 'Liabilities')
        ) {
          return acc
        } else if (
          type === 'grouped' &&
          cardName !== 'Assets' &&
          cardName !== 'Liabilities'
        ) {
          return acc
        }

        const foundMarker = valuesMap[currentX]
        if (foundMarker) {
          acc[cardName] = foundMarker
        }

        return acc
      }, {} as { [cardName: string]: number })
    )
  }, [currentX])

  return (
    <GroupedPlot
      {...{
        width: windowWidth,
        height: windowHeight,
        assetLineSeries: historicalBalancesLineSeries.Assets,
        liabilityLineSeries: historicalBalancesLineSeries.Liabilities,
      }}
    ></GroupedPlot>

    // <div ref={hoverRef as React.MutableRefObject<any>}>
    //   <XYPlot
    //     height={windowHeight - 250}
    //     width={windowWidth - 300}
    //     xType="time"
    //     margin={{ left: 70, right: 10, top: 10, bottom: 70 }}
    //     style={{ cursor: 'pointer' }}
    //   >
    //     {/* <DiscreteColorLegend items={[{ title: 'test' }]} /> */}

    //     <VerticalGridLines />
    //     <HorizontalGridLines />
    //     <XAxis
    //       tickLabelAngle={315}
    //       tickFormat={time => moment(time).format('MMM Do, YYYY')}
    //     />
    //     <YAxis tickFormat={amount => `$${amount}`} />

    //     {type === 'combined' ? (
    //       <LineMarkSeries
    //         color="#00B7E4"
    //         data={historicalBalancesLineSeries.Combined}
    //         onNearestX={value => {
    //           if (currentX !== value.x) {
    //             setCurrentX(value.x as number)
    //           }
    //         }}
    //         curve={'curveMonotoneX'}
    //       />
    //     ) : type === 'grouped' ? (
    //       [
    //         <LineMarkSeries
    //           color="#00b44b"
    //           data={historicalBalancesLineSeries.Assets}
    //           onNearestX={value => {
    //             if (currentX !== value.x) {
    //               setCurrentX(value.x as number)
    //             }
    //           }}
    //           curve={'curveMonotoneX'}
    //         />,
    //         <LineMarkSeries
    //           color="#bb0120"
    //           data={historicalBalancesLineSeries.Liabilities}
    //           curve={'curveMonotoneX'}
    //         />,
    //       ]
    //     ) : type === 'individual' ? (
    //       Object.entries(historicalBalancesLineSeries).reduce(
    //         (acc, [cardName, seriesValues], i) => {
    //           if (cardName !== 'Assets' && cardName !== 'Liabilities') {
    //             acc.push(
    //               <LineMarkSeries
    //                 {...{
    //                   data: seriesValues,
    //                   key: i,
    //                   // Need to render the combined graph to ensure we have onNearestX that encompasses all x's, but we make it invisible
    //                   onNearestX:
    //                     cardName === 'Combined'
    //                       ? value => {
    //                           if (currentX !== value.x) {
    //                             setCurrentX(value.x as number)
    //                           }
    //                         }
    //                       : undefined,
    //                   curve: 'curveMonotoneX',
    //                   style: cardName === 'Combined' ? { opacity: 0 } : {},
    //                   color: colors[i],
    //                 }}
    //               />
    //             )
    //           }

    //           return acc
    //         },
    //         []
    //       )
    //     ) : null}

    //     {isHovered && (
    //       <Crosshair values={[{ x: currentX }]}>
    //         <HistoricalBalancesCrosshairDisplay
    //           time={currentX}
    //           currentYs={currentYs}
    //         />
    //       </Crosshair>
    //     )}
    //   </XYPlot>
    // </div>
  )
}

const useBalancesMap = (
  balancesLineSeries: HistoricalBalanceLineSeries
): {
  [series: string]: { [x: number]: number }
} => {
  const [balancesMap, setBalancesMap] = useState<{
    [series: string]: { [x: number]: number }
  }>({})
  useEffect(() => {
    setBalancesMap(
      Object.entries(balancesLineSeries).reduce(
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
  }, [balancesLineSeries])

  return balancesMap
}
