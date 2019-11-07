import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CurrentItems } from '../components/CurrentItems'
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
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        <CurrentItems
          {...{
            cardsByItems,
            fetchRemoveItemAction,
          }}
        />
        <AddNewItem
          {...{
            user,
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