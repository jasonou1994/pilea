import React, { FunctionComponent, useState } from 'react'
import { HistoricalBalances } from '../reducers/transactionsAccounts'

interface Props {
  historicalBalances: HistoricalBalances
}

export const HistoricalBalancesChart: FunctionComponent<Props> = ({
  historicalBalances,
}) => {
  const [combinedBalances, setCombinedBalances] = useState<HistoricalBalances>(
    {}
  )

  return <div style={{ border: '1px solid black' }}>Historical Balances</div>
}
