import React, { FunctionComponent } from 'react'
import {
  XYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
} from 'react-vis'
import { useHover } from '../../utilities/hooks'
import moment from 'moment'

interface PlotProps {
  width: number
  height: number
}
export const Plot: FunctionComponent<PlotProps> = ({
  width,
  height,
  children,
}) => {
  const [hoverRef, isHovered] = useHover()

  const flattenedChildren = (children as any[]).reduce((acc, cur) => {
    if (Array.isArray(cur)) {
      acc = [...acc, ...cur]
    } else {
      acc.push(cur)
    }

    return acc
  }, [])

  return (
    <div ref={hoverRef as React.MutableRefObject<any>}>
      <XYPlot
        height={height - 230}
        width={width - 255}
        xType="time"
        margin={{ left: 70, right: 30, top: 20, bottom: 80 }}
        style={{ cursor: 'pointer' }}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis
          tickLabelAngle={315}
          tickFormat={time => moment(time).format('MMM Do, YYYY')}
        />
        <YAxis tickFormat={amount => `$${amount}`} />

        {(flattenedChildren as any[]).reduce((acc, cur) => {
          switch (cur.type.name) {
            case 'Crosshair': {
              if (isHovered) {
                acc.push(cur)
              }
              break
            }
            default: {
              acc.push(cur)
              break
            }
          }

          return acc
        }, [])}
      </XYPlot>
    </div>
  )
}
