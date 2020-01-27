import React, { FunctionComponent } from 'react'
import ReactPivot from 'react-pivot'

interface PivotProps {
  activeDimensions?: string[]
  calculations: Calculation[]
  dimensions: Dimension[]
  hiddenColumns?: string[]
  reduce: Reduce
  rows: any[]
  solo?: object
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

interface Dimension {
  template?: (value: any) => any
  title: string
  value: string
}

type Reduce = (row: any, memo: object) => object

interface Calculation {
  className?: string
  sortBy?: (row: any) => any
  template?: (val: any, row: any) => any
  title: string
  value: any
}

export const Pivot: FunctionComponent<PivotProps> = ({
  dimensions,
  reduce,
  calculations,
  rows,
  activeDimensions,
  hiddenColumns,
  solo,
  sortBy,
  sortDir,
}) => {
  return (
    <ReactPivot
      {...{
        dimensions,
        reduce,
        calculations,
        rows,
        activeDimensions,
        hiddenColumns,
        solo,
        sortBy,
        sortDir,
      }}
    />
  )
}
