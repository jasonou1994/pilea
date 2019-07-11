import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CurrentItems } from '../components/CurrentItems'
import { AddNewItem } from '../components/AddNewItem'
import { RefreshItemData } from '../components/RefreshItemData'
import { cardsByItemsSelector } from '../reducers'
import { ItemWithCards } from '../reducers/transactionsAccounts'
import {
  fetchAddItem,
  FetchAddItemActionCreator,
  fetchRefreshTransactions,
  FetchRefreshTransactionsActionCreator,
} from '../actions'

interface ItemsContainerProps {
  cardsByItems: ItemWithCards[]

  fetchAddItemAction: FetchAddItemActionCreator
  fetchRefreshTransactionsAction: FetchRefreshTransactionsActionCreator
}

interface ItemsContainerState {}

class _ItemsContainer extends Component<
  ItemsContainerProps,
  ItemsContainerState
> {
  render() {
    const {
      cardsByItems,
      fetchAddItemAction,
      fetchRefreshTransactionsAction,
    } = this.props

    return (
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        ItemsContainer
        <CurrentItems
          {...{
            cardsByItems,
          }}
        />
        <AddNewItem
          {...{
            fetchAddItemAction,
          }}
        />
        {cardsByItems.length > 0 && (
          <RefreshItemData
            {...{
              cardsByItems,
              fetchRefreshTransactionsAction,
            }}
          />
        )}
      </div>
    )
  }
}

export default connect(
  state => ({
    cardsByItems: cardsByItemsSelector(state),
  }),
  {
    fetchAddItemAction: fetchAddItem,
    fetchRefreshTransactionsAction: fetchRefreshTransactions,
  }
)(_ItemsContainer)
