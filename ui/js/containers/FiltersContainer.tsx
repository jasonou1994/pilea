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
  resetCategoriesSelected,
  ResetCategoriesSelectedActionCreator,
  setCategoriesSelected,
  SetCategoriesSelectedActionCreator,
} from '../actions'
import '../../scss/index.scss'

interface FiltersContainerProps {
  cardsByItems: ItemWithCards[]
  categoryData: CategoryData
  toggleItemSelectedAction: ToggleItemSelectedActionCreator
  toggleCardSelectedAction: ToggleCardSelectedActionCreator
  resetSelectedTransactionKeyAction: ResetSelectedTransactionActionCreator
  resetCategoriesSelectedAction: ResetCategoriesSelectedActionCreator
  setCategoriesSelectedAction: SetCategoriesSelectedActionCreator
}

class _FiltersContainer extends Component<FiltersContainerProps> {
  render() {
    const {
      cardsByItems,
      categoryData,
      toggleCardSelectedAction,
      toggleItemSelectedAction,
      resetSelectedTransactionKeyAction,
      resetCategoriesSelectedAction,
      setCategoriesSelectedAction,
    } = this.props

    return (
      <div id="filters">
        <h2>Filters</h2>
        <CardFilter
          {...{
            cardsByItems,
            toggleCardSelectedAction,
            toggleItemSelectedAction,
            resetSelectedTransactionKeyAction,
            setCategoriesSelectedAction,
          }}
        />
        <CategoryFilter
          {...{
            categoryData,
            resetCategoriesSelectedAction,
            setCategoriesSelectedAction,
          }}
        />
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
    resetCategoriesSelectedAction: resetCategoriesSelected,
    setCategoriesSelectedAction: setCategoriesSelected,
  }
)(_FiltersContainer)
