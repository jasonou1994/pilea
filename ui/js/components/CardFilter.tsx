import React, { FunctionComponent } from 'react'
import {
  ResetSelectedTransactionActionCreator,
  ToggleCardSelectedActionCreator,
  ToggleItemSelectedActionCreator,
} from '../actions'
import { ItemWithCards } from '../reducers'
import { CardFilterRow } from './CardFilterRow'

interface CardFilterProps {
  cardsByItems: ItemWithCards[]
  resetSelectedTransactionKeyAction: ResetSelectedTransactionActionCreator
  toggleCardSelectedAction: ToggleCardSelectedActionCreator
  toggleItemSelectedAction: ToggleItemSelectedActionCreator
}

export const CardFilter: FunctionComponent<CardFilterProps> = props => {
  const {
    cardsByItems,
    toggleCardSelectedAction,
    toggleItemSelectedAction,
    resetSelectedTransactionKeyAction,
  } = props

  const filterRows = cardsByItems.reduce((acc, item) => {
    acc.push(
      <CardFilterRow
        key={item.accessToken}
        selected={item.selected}
        indentLevel={0}
        displayName={item.alias ? item.alias : item.accessToken}
        onCheckboxClick={() => {
          resetSelectedTransactionKeyAction()
          toggleItemSelectedAction(item.id)
        }}
      />
    )

    acc.push(
      item.cards.map((card, i) => (
        <CardFilterRow
          key={i}
          selected={card.selected}
          indentLevel={1}
          displayName={card.official_name || card.name}
          onCheckboxClick={() => {
            resetSelectedTransactionKeyAction()
            toggleCardSelectedAction(card.account_id)
          }}
        />
      ))
    )

    return acc
  }, [])

  return (
    <>
      <h4>Cards</h4>
      <div id="card-filter-contents">{filterRows}</div>
    </>
  )
}
