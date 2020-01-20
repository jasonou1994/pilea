import React, { FunctionComponent } from 'react'
import { connect } from 'react-redux'
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
  fetchRemoveItemAction,
}) => {
  return (
    <div id="item-panel">
      {cardsByItems.length === 0 ? (
        <p>
          Uh oh, you haven't added any active institutions. Please add an
          institution with an active financial product to view data.
        </p>
      ) : (
        <div className="items-content">
          <CurrentItems
            {...{
              cardsByItems,
              fetchRemoveItemAction,
            }}
          />
          <HistoricalBalancesContainer />
        </div>
      )}
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
