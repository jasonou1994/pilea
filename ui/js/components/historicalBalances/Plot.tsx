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

  return (
    <div ref={hoverRef as React.MutableRefObject<any>}>
      <XYPlot
        height={height - 250}
        width={width - 300}
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

        {(children as any[]).reduce((acc, cur) => {
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
