import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CardFilter } from '../components/CardFilter'
import { CategoryFilter } from '../components/CategoryFilter'
import { cardsByItemsSelector, ItemWithCards } from '../reducers'
import {
  toggleCardSelected,
  toggleItemSelected,
  ToggleItemSelectedActionCreator,
  ToggleCardSelectedActionCreator,
  resetSelectedTransactionKey,
  ResetSelectedTransactionActionCreator,
} from '../actions'

interface FiltersContainerProps {
  cardsByItems: ItemWithCards[]
  toggleItemSelectedAction: ToggleItemSelectedActionCreator
  toggleCardSelectedAction: ToggleCardSelectedActionCreator
  resetSelectedTransactionKeyAction: ResetSelectedTransactionActionCreator
}

interface FiltersContainerState {}

class _FiltersContainer extends Component<
  FiltersContainerProps,
  FiltersContainerState
> {
  render() {
    const {
      cardsByItems,
      toggleCardSelectedAction,
      toggleItemSelectedAction,
      resetSelectedTransactionKeyAction,
    } = this.props

    return (
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        <CardFilter
          {...{
            cardsByItems,
            toggleCardSelectedAction,
            toggleItemSelectedAction,
            resetSelectedTransactionKeyAction,
          }}
        />
        <CategoryFilter />
      </div>
    )
  }
}

export default connect(
  state => ({
    cardsByItems: cardsByItemsSelector(state),
  }),
  {
    toggleCardSelectedAction: toggleCardSelected,
    toggleItemSelectedAction: toggleItemSelected,
    resetSelectedTransactionKeyAction: resetSelectedTransactionKey,
  }
)(_FiltersContainer)
