import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CurrentItems } from '../components/CurrentItems'
import { AddNewItem } from '../components/AddNewItem'
import { RefreshItemData } from '../components/RefreshItemData'

interface ItemsContainerProps {}

interface ItemsContainerState {}

class _ItemsContainer extends Component<
  ItemsContainerProps,
  ItemsContainerState
> {
  static state = {}

  render() {
    return (
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        ItemsContainer
        <CurrentItems />
        <AddNewItem />
        <RefreshItemData />
      </div>
    )
  }
}

export default connect(
  state => ({}),
  {}
)(_ItemsContainer)
