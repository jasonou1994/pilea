import React, { FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { AddNewItem } from '../components/AddNewItem'
import {
  fetchAddItem,
  FetchAddItemActionCreator,
  fetchRemoveItem,
  FetchRemoveItemActionCreator,
} from '../actions'
import { User, userSelector } from '../reducers/login'
import { ItemWithCards, RootState, itemsWithCardsSelector } from '../reducers'
import { CurrentItems } from '../components/ItemCollection'
import { HistoricalBalancesContainer } from './HistoricalBalancesContainer'

interface ItemsContainerProps {
  cardsByItems: ItemWithCards[]
  user: User

  fetchAddItemAction: FetchAddItemActionCreator
  fetchRemoveItemAction: FetchRemoveItemActionCreator
}

const ItemsContainer: FunctionComponent<ItemsContainerProps> = ({
  cardsByItems,
  fetchAddItemAction,
  fetchRemoveItemAction,
  user,
}) => {
  return (
    <div id="item-panel">
      <h2>Your Accounts</h2>
      <AddNewItem
        {...{ onConfirm: fetchAddItemAction, hidden: !user.confirmed }}
      />

      <HistoricalBalancesContainer />

      <CurrentItems
        {...{
          cardsByItems,
          fetchRemoveItemAction,
        }}
      />
    </div>
  )
}

export default connect(
  (state: RootState) => ({
    cardsByItems: itemsWithCardsSelector(state),
    user: userSelector(state),
  }),
  {
    fetchAddItemAction: fetchAddItem,
    fetchRemoveItemAction: fetchRemoveItem,
  }
)(ItemsContainer)
