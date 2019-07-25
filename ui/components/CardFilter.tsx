import React, { Component } from 'react'
import { ItemWithCards } from '../reducers'
import { FilterRow } from './FilterRow'
import {
  ToggleItemSelectedActionCreator,
  ToggleCardSelectedActionCreator,
  ResetSelectedTransactionActionCreator,
} from '../actions'

interface CardFilterProps {
  cardsByItems: ItemWithCards[]
  toggleItemSelectedAction: ToggleItemSelectedActionCreator
  toggleCardSelectedAction: ToggleCardSelectedActionCreator
  resetSelectedTransactionKeyAction: ResetSelectedTransactionActionCreator
}

interface CardFilterState {}

export class CardFilter extends Component<CardFilterProps, CardFilterState> {
  render() {
    const {
      cardsByItems,
      toggleCardSelectedAction,
      toggleItemSelectedAction,
      resetSelectedTransactionKeyAction,
    } = this.props

    const filterRows = cardsByItems.reduce((acc, item) => {
      acc.push(
        <FilterRow
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
          <FilterRow
            key={i}
            selected={card.selected}
            indentLevel={1}
            displayName={card.official_name}
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
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        {filterRows}
      </div>
    )
  }
}
