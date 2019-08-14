import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CardFilter } from '../components/CardFilter'
import { CategoryFilter } from '../components/CategoryFilter'
import {
  cardsByItemsSelector,
  ItemWithCards,
  RootState,
  categoryDataSelector,
  CategoryData,
} from '../reducers'
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
  categoryData: CategoryData
  toggleItemSelectedAction: ToggleItemSelectedActionCreator
  toggleCardSelectedAction: ToggleCardSelectedActionCreator
  resetSelectedTransactionKeyAction: ResetSelectedTransactionActionCreator
}

class _FiltersContainer extends Component<FiltersContainerProps> {
  render() {
    const {
      cardsByItems,
      categoryData,
      toggleCardSelectedAction,
      toggleItemSelectedAction,
      resetSelectedTransactionKeyAction,
    } = this.props

    console.log(categoryData)

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
  (state: RootState) => ({
    cardsByItems: cardsByItemsSelector(state),
    categoryData: categoryDataSelector(state),
  }),
  {
    toggleCardSelectedAction: toggleCardSelected,
    toggleItemSelectedAction: toggleItemSelected,
    resetSelectedTransactionKeyAction: resetSelectedTransactionKey,
  }
)(_FiltersContainer)
