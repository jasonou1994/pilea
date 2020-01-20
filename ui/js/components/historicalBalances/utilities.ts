import { useEffect, useState } from 'react'
import { LineSeries } from '../../reducers'

// Converts line series array to map for quicker access
export interface LineSeriesMap {
  [x: number]: number
}

export const useLineSeriesMap: (
  series: LineSeries
) => LineSeriesMap = series => {
  const [map, setMap] = useState<LineSeriesMap>({})

  useEffect(
    () => setMap(series.reduce((acc, { x, y }) => ({ ...acc, [x]: y }), {})),
    [series]
  )

  return map
}

export interface CurrentYs {
  [cardName: string]: number
}

export const useCurrentYs: (
  lineSeriesMaps: {
    [cardName: string]: LineSeriesMap
  },
  currentX: number
) => CurrentYs = (lineSeriesMaps, currentX) => {
  const [currentYs, setCurrentYs] = useState<CurrentYs>({})

  useEffect(
    () =>
      setCurrentYs(
        Object.entries(lineSeriesMaps).reduce((acc, [cardName, map]) => {
          const foundMarker = map[currentX]
          if (foundMarker) {
            acc[cardName] = foundMarker
          }

          return acc
        }, {} as CurrentYs)
      ),
    [currentX]
  )

  return currentYs
}
