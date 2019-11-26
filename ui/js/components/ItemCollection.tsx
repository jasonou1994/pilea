import React, { Component } from 'react'
import { ItemWithCards } from '../reducers'
import { FetchRemoveItemActionCreator } from '../actions'
import { ItemDisplay } from './ItemDisplay'

interface CurrentItemsProps {
  cardsByItems: ItemWithCards[]
  fetchRemoveItemAction: FetchRemoveItemActionCreator
}

interface CurrentItemsState {}

export class CurrentItems extends Component<
  CurrentItemsProps,
  CurrentItemsState
> {
  render() {
    const { cardsByItems, fetchRemoveItemAction } = this.props

    return (
      <div>
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
  }
}
