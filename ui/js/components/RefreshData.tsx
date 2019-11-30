import React, { Component } from 'react'
import moment from 'moment'
import { FetchRefreshTransactionsActionCreator } from '../actions'
import { ItemWithCards } from '../reducers'
import { Button } from './common/Button'

interface RefreshDataProps {
  cardsByItems: ItemWithCards[]
  fetchRefreshTransactionsAction: FetchRefreshTransactionsActionCreator
}

export class RefreshData extends Component<RefreshDataProps> {
  render() {
    const { cardsByItems, fetchRefreshTransactionsAction } = this.props

    return (
      <div className="refresh-data">
        <Button
          {...{
            type: 'normal',
            disabled: false,
            text: 'Refresh Now',
            onClick: () => fetchRefreshTransactionsAction({}),
            style: { marginRight: '10px' },
          }}
        />
        <span>
          {`Your data was last refreshed on: ${moment(
            cardsByItems[0].lastUpdated.replace(/"/g, '')
          ).format('dddd, MMMM Do YYYY, h:mm a')}`}
        </span>
      </div>
    )
  }
}
