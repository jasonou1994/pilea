import React, { FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { AddNewItem } from '../components/AddNewItem'
import { HistoricalBalancesChart } from '../components/HistoricalBalancesChart'

import {
  fetchAddItem,
  FetchAddItemActionCreator,
  fetchRemoveItem,
  FetchRemoveItemActionCreator,
} from '../actions'
import { User, userSelector } from '../reducers/login'
import { ItemWithCards, RootState, itemsWithCardsSelector } from '../reducers'
import {
  historicalBalancesSelector,
  HistoricalBalances,
} from '../reducers/transactionsAccounts'
import { CurrentItems } from '../components/ItemCollection'

interface ItemsContainerProps {
  cardsByItems: ItemWithCards[]
  user: User
  historicalBalances: HistoricalBalances

  fetchAddItemAction: FetchAddItemActionCreator
  fetchRemoveItemAction: FetchRemoveItemActionCreator
}

const ItemsContainer: FunctionComponent<ItemsContainerProps> = ({
  cardsByItems,
  fetchAddItemAction,
  fetchRemoveItemAction,
  user,
  historicalBalances,
}) => {
  return (
    <div id="item-panel">
      <h2>Your Accounts</h2>
      <AddNewItem
        {...{ onConfirm: fetchAddItemAction, hidden: !user.confirmed }}
      />
      <HistoricalBalancesChart
        {...{ historicalBalances }}
      ></HistoricalBalancesChart>

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
    historicalBalances: historicalBalancesSelector(state),
  }),
  {
    fetchAddItemAction: fetchAddItem,
    fetchRemoveItemAction: fetchRemoveItem,
  }
)(ItemsContainer)
