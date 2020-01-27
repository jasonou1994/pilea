import React, { FunctionComponent } from 'react'
import { HistoricalBalanceLineSeries } from '../../reducers'
import { AvailableHistoricalGraphTypes } from '../../reducers/graph'
import { CombinedPlot } from './CombinedPlot'
import { GroupedPlot } from './GroupedPlot'
import { IndividualPlot } from './IndividualPlot'

interface Props {
  height: number
  historicalBalancesLineSeries: HistoricalBalanceLineSeries
  type: AvailableHistoricalGraphTypes
  width: number
}

export const HistoricalBalancesChart: FunctionComponent<Props> = ({
  historicalBalancesLineSeries,
  type,
  width,
  height,
}) => {
  const {
    combined,
    assets,
    liabilities,
    ...individual
  } = historicalBalancesLineSeries

  return type === 'grouped' ? (
    <GroupedPlot
      {...{
        width: width,
        height: height,
        assetLineSeries: assets,
        liabilityLineSeries: liabilities,
      }}
    />
  ) : type === 'combined' ? (
    <CombinedPlot
      {...{
        width: width,
        height: height,
        combinedLineSeries: combined,
      }}
    />
  ) : (
    <IndividualPlot
      {...{
        width: width,
        height: height,
        combinedLineSeries: combined,
        individualLineSeries: individual,
      }}
    />
  )
}
