import React, { Component } from 'react'
import { ItemWithCards } from '../reducers/transactionsAccounts'
import moment from 'moment'
import { FetchRefreshTransactionsActionCreator } from '../actions'

interface RefreshItemDataProps {
  cardsByItems: ItemWithCards[]
  fetchRefreshTransactionsAction: FetchRefreshTransactionsActionCreator
}

interface RefreshItemDataState {}

export class RefreshItemData extends Component<
  RefreshItemDataProps,
  RefreshItemDataState
> {
  render() {
    const { cardsByItems, fetchRefreshTransactionsAction } = this.props

    return (
      <div
        style={{
          border: '1px solid green',
          padding: '5px',
        }}
      >
        <div>
          Your data was last refreshed on:
          {moment(cardsByItems[0].lastUpdated.replace(/"/g, '')).format(
            'dddd, MMMM Do YYYY, h:mm:ss a'
          )}
        </div>
        <button onClick={fetchRefreshTransactionsAction}>Refresh now</button>
      </div>
    )
  }
}
