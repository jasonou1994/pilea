import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CardFilter } from '../components/CardFilter'
import { CategoryFilter } from '../components/CategoryFilter'
import { cardsByItemsSelector, ItemWithCards } from '../reducers'

interface FiltersContainerProps {
  cardsByItems: ItemWithCards[]
}

interface FiltersContainerState {}

class _FiltersContainer extends Component<
  FiltersContainerProps,
  FiltersContainerState
> {
  static state = {}

  render() {
    const { cardsByItems } = this.props

    return (
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        <CardFilter {...{ cardsByItems }} />
        <CategoryFilter />
      </div>
    )
  }
}

export default connect(
  state => ({
    cardsByItems: cardsByItemsSelector(state),
  }),
  {}
)(_FiltersContainer)
