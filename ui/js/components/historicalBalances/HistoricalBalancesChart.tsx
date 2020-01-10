import React, { FunctionComponent } from 'react'
import { HistoricalBalanceLineSeries } from '../../reducers'
import { AvailableHistoricalGraphTypes } from '../../reducers/graph'
import { CombinedPlot } from './CombinedPlot'
import { GroupedPlot } from './GroupedPlot'
import { IndividualPlot } from './IndividualPlot'

interface Props {
  historicalBalancesLineSeries: HistoricalBalanceLineSeries
  type: AvailableHistoricalGraphTypes
  windowWidth: number
  windowHeight: number
}

export const HistoricalBalancesChart: FunctionComponent<Props> = ({
  historicalBalancesLineSeries,
  type,
  windowWidth,
  windowHeight,
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
        width: windowWidth,
        height: windowHeight,
        assetLineSeries: Assets,
        liabilityLineSeries: Liabilities,
      }}
    />
  ) : type === 'combined' ? (
    <CombinedPlot
      {...{
        width: windowWidth,
        height: windowHeight,
        combinedLineSeries: Combined,
      }}
    />
  ) : (
    <IndividualPlot
      {...{
        width: windowWidth,
        height: windowHeight,
        combinedLineSeries: Combined,
        individualLineSeries: individual,
      }}
    ></IndividualPlot>
  )
}
