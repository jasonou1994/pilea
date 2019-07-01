import React, { Component } from 'react'
import { connect } from 'react-redux'

interface CategoryFilterProps {}

interface CategoryFilterState {}

export class CategoryFilter extends Component<
  CategoryFilterProps,
  CategoryFilterState
> {
  static state = {}

  render() {
    return (
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        CategoryFilter
      </div>
    )
  }
}
