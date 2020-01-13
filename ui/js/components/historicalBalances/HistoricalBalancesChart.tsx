import React, { FunctionComponent } from 'react'
import { HistoricalBalanceLineSeries } from '../../reducers'
import { AvailableHistoricalGraphTypes } from '../../reducers/graph'
import { CombinedPlot } from './CombinedPlot'
import { GroupedPlot } from './GroupedPlot'
import { IndividualPlot } from './IndividualPlot'

interface Props {
  historicalBalancesLineSeries: HistoricalBalanceLineSeries
  type: AvailableHistoricalGraphTypes
  width: number
  height: number
}

export const HistoricalBalancesChart: FunctionComponent<Props> = ({
  historicalBalancesLineSeries,
  type,
  width,
  height,
}) => {
  const {
    Combined,
    Assets,
    Liabilities,
    ...individual
  } = historicalBalancesLineSeries

  return type === 'grouped' ? (
    <GroupedPlot
      {...{
        width: width,
        height: height,
        assetLineSeries: Assets,
        liabilityLineSeries: Liabilities,
      }}
    />
  ) : type === 'combined' ? (
    <CombinedPlot
      {...{
        width: width,
        height: height,
        combinedLineSeries: Combined,
      }}
    />
  ) : (
    <IndividualPlot
      {...{
        width: width,
        height: height,
        combinedLineSeries: Combined,
        individualLineSeries: individual,
      }}
    />
  )
}
