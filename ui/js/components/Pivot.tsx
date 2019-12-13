import React, { FunctionComponent } from 'react'
import ReactPivot from 'react-pivot'

interface PivotProps {
  dimensions: Dimension[]
  reduce: Reduce
  calculations: Calculation[]
  rows: any[]
  activeDimensions?: string[]
  hiddenColumns?: string[]
  solo?: object
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

interface Dimension {
  title: string
  value: string
  template?: (value: any) => any
}

type Reduce = (row: any, memo: object) => object

interface Calculation {
  title: string
  value: any
  template?: (val: any, row: any) => any
  sortBy?: (row: any) => any
  className?: string
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
