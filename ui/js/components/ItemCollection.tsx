import React, { FunctionComponent } from 'react'
import { ItemWithCards } from '../reducers'
import { FetchRemoveItemActionCreator } from '../actions'
import { ItemDisplay } from './ItemDisplay'

interface CurrentItemsProps {
  cardsByItems: ItemWithCards[]
  fetchRemoveItemAction: FetchRemoveItemActionCreator
}

export const CurrentItems: FunctionComponent<CurrentItemsProps> = ({
  cardsByItems,
  fetchRemoveItemAction,
}) => (
  <div className="items-current-items">
    <h2>Institutions</h2>
    {cardsByItems.length >= 0 ? (
      <div className="items-collection">
        {cardsByItems.map((item, i) => (
          <ItemDisplay
            key={i}
            item={item}
            fetchRemoveItemAction={fetchRemoveItemAction}
          ></ItemDisplay>
        ))}
      </div>
    ) : (
      <div>Please add an institution to continue.</div>
    )}
  </div>
)
