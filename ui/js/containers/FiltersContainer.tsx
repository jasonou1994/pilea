import React, { FunctionComponent } from 'react'
import { connect } from 'react-redux'
import '../../scss/index.scss'
import {
  ResetSelectedTransactionActionCreator,
  resetSelectedTransactionKey,
  selectAllCategories,
  SelectAllCategoriesActionCreator,
  selectSingleCategory,
  SelectSingleCategoryActionCreator,
  setCategoriesSelected,
  SetCategoriesSelectedActionCreator,
  toggleCardSelected,
  ToggleCardSelectedActionCreator,
  toggleCategorySelected,
  ToggleCategorySelectedActionCreator,
  toggleItemSelected,
  ToggleItemSelectedActionCreator,
} from '../actions'
import { CardFilter } from '../components/CardFilter'
import { CategoryFilter } from '../components/CategoryFilter'
import {
  CategoriesWithTxData,
  categoryDataSelector,
  itemsWithCardsSelector,
  ItemWithCards,
  RootState,
} from '../reducers'

interface FiltersContainerProps {
  cardsByItems: ItemWithCards[]
  categoryData: CategoriesWithTxData
  resetSelectedTransactionKeyAction: ResetSelectedTransactionActionCreator
  selectAllCategoriesAction: SelectAllCategoriesActionCreator
  selectSingleCategoryAction: SelectSingleCategoryActionCreator
  setCategoriesSelectedAction: SetCategoriesSelectedActionCreator
  toggleCardSelectedAction: ToggleCardSelectedActionCreator
  toggleCategorySelectedAction: ToggleCategorySelectedActionCreator
  toggleItemSelectedAction: ToggleItemSelectedActionCreator
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
