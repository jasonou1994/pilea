import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CardFilter } from '../components/CardFilter'
import { CategoryFilter } from '../components/CategoryFilter'
import {
  itemsWithCardsSelector,
  ItemWithCards,
  RootState,
  categoryDataSelector,
  CategoriesWithTxData,
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
  toggleCategorySelected,
  ToggleCategorySelectedActionCreator,
} from '../actions'
import '../../scss/index.scss'

interface FiltersContainerProps {
  cardsByItems: ItemWithCards[]
  categoryData: CategoriesWithTxData
  toggleItemSelectedAction: ToggleItemSelectedActionCreator
  toggleCardSelectedAction: ToggleCardSelectedActionCreator
  resetSelectedTransactionKeyAction: ResetSelectedTransactionActionCreator
  resetCategoriesSelectedAction: ResetCategoriesSelectedActionCreator
  setCategoriesSelectedAction: SetCategoriesSelectedActionCreator
  toggleCategorySelectedAction: ToggleCategorySelectedActionCreator
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
      toggleCategorySelectedAction,
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
            toggleCategorySelectedAction,
          }}
        />
      </div>
    )
  }
}

export default connect(
  (state: RootState) => ({
    cardsByItems: itemsWithCardsSelector(state),
    categoryData: categoryDataSelector(state),
  }),
  {
    toggleCardSelectedAction: toggleCardSelected,
    toggleItemSelectedAction: toggleItemSelected,
    resetSelectedTransactionKeyAction: resetSelectedTransactionKey,
    resetCategoriesSelectedAction: resetCategoriesSelected,
    setCategoriesSelectedAction: setCategoriesSelected,
    toggleCategorySelectedAction: toggleCategorySelected,
  }
)(_FiltersContainer)
