import React, { Component } from 'react'
import { ItemWithCards } from '../reducers'
import { FilterRow } from './FilterRow'

interface CardFilterProps {
  cardsByItems: ItemWithCards[]
}

interface CardFilterState {}

export class CardFilter extends Component<CardFilterProps, CardFilterState> {
  render() {
    const { cardsByItems } = this.props

    console.log(cardsByItems)

    return (
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      />
    )
  }
}
