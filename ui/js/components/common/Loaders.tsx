import React, { FunctionComponent } from 'react'
import Loader from 'react-loader-spinner'

export const LogInLoading: FunctionComponent = () => (
  <div className="loader">
    <div className="loader-title" style={{ marginBottom: '35px' }}>
      Logging in...
    </div>
    <Loader {...{ type: 'Grid', color: 'grey', height: 60, width: 60 }} />
  </div>
)

export const TransactionsLoading: FunctionComponent = () => (
  <div className="loader">
    <div className="loader-title" style={{ marginBottom: '35px' }}>
      Please wait. Fetching your transaction and account data.
    </div>
    <Loader {...{ type: 'Grid', color: 'grey', height: 60, width: 60 }} />
  </div>
)

export const TransactionsRefreshing: FunctionComponent<{
  count: number
}> = ({ count }) => (
  <div className="loader">
    <div className="loader-title">
      Please wait. Refreshing your transaction and account data.
    </div>
    <div className="loader-title" style={{ marginBottom: '35px' }}>
      <span className="count">{String(count)}</span> transactions processed so
      far.
    </div>
    <Loader {...{ type: 'Grid', color: 'grey', height: 60, width: 60 }} />
  </div>
)
