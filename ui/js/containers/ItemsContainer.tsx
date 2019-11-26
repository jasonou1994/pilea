import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CurrentItems } from '../components/ItemCollection'
import { AddNewItem } from '../components/AddNewItem'
import { RefreshItemData } from '../components/RefreshItemData'
import {
  cardsByItemsSelector,
  ItemWithCards,
  RootState,
  userSelector,
} from '../reducers'
import {
  fetchAddItem,
  FetchAddItemActionCreator,
  fetchRefreshTransactions,
  FetchRefreshTransactionsActionCreator,
  fetchRemoveItem,
  FetchRemoveItemActionCreator,
} from '../actions'
import { User } from '../reducers/login'

interface ItemsContainerProps {
  cardsByItems: ItemWithCards[]
  user: User

  fetchAddItemAction: FetchAddItemActionCreator
  fetchRefreshTransactionsAction: FetchRefreshTransactionsActionCreator
  fetchRemoveItemAction: FetchRemoveItemActionCreator
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
      fetchRemoveItemAction,
      user,
    } = this.props

    return (
      <div id="item-panel">
        <h2>Your Accounts</h2>
        {cardsByItems.length > 0 && (
          <RefreshItemData
            {...{
              cardsByItems,
              fetchRefreshTransactionsAction,
            }}
          />
        )}
        <AddNewItem
          {...{ onClick: fetchAddItemAction, hidden: !user.confirmed }}
        />

        <CurrentItems
          {...{
            cardsByItems,
            fetchRemoveItemAction,
          }}
        />
      </div>
    )
  }
}

export default connect(
  (state: RootState) => ({
    cardsByItems: cardsByItemsSelector(state),
    user: userSelector(state),
  }),
  {
    fetchAddItemAction: fetchAddItem,
    fetchRefreshTransactionsAction: fetchRefreshTransactions,
    fetchRemoveItemAction: fetchRemoveItem,
  }
)(_ItemsContainer)
