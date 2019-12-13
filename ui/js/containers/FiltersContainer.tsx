import React, { FunctionComponent } from 'react'
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
  selectAllCategories,
  SelectAllCategoriesActionCreator,
  setCategoriesSelected,
  SetCategoriesSelectedActionCreator,
  toggleCategorySelected,
  ToggleCategorySelectedActionCreator,
  selectSingleCategory,
  SelectSingleCategoryActionCreator,
} from '../actions'
import '../../scss/index.scss'

interface FiltersContainerProps {
  cardsByItems: ItemWithCards[]
  categoryData: CategoriesWithTxData
  toggleItemSelectedAction: ToggleItemSelectedActionCreator
  toggleCardSelectedAction: ToggleCardSelectedActionCreator
  resetSelectedTransactionKeyAction: ResetSelectedTransactionActionCreator
  selectAllCategoriesAction: SelectAllCategoriesActionCreator
  setCategoriesSelectedAction: SetCategoriesSelectedActionCreator
  toggleCategorySelectedAction: ToggleCategorySelectedActionCreator
  selectSingleCategoryAction: SelectSingleCategoryActionCreator
}

const FiltersContainer: FunctionComponent<FiltersContainerProps> = ({
  cardsByItems,
  categoryData,
  toggleCardSelectedAction,
  toggleItemSelectedAction,
  resetSelectedTransactionKeyAction,
  selectAllCategoriesAction,
  setCategoriesSelectedAction,
  toggleCategorySelectedAction,
  selectSingleCategoryAction,
}) => {
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
          selectAllCategoriesAction,
          setCategoriesSelectedAction,
          toggleCategorySelectedAction,
          selectSingleCategoryAction,
        }}
      />
    </div>
  )
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
    selectAllCategoriesAction: selectAllCategories,
    setCategoriesSelectedAction: setCategoriesSelected,
    toggleCategorySelectedAction: toggleCategorySelected,
    selectSingleCategoryAction: selectSingleCategory,
  }
)(FiltersContainer)
