import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AccountFilter } from '../components/AccountFilter'
import { CategoryFilter } from '../components/CategoryFilter'

interface FiltersContainerProps {}

interface FiltersContainerState {}

class _FiltersContainer extends Component<
  FiltersContainerProps,
  FiltersContainerState
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
        FiltersContainer
        <AccountFilter />
        <CategoryFilter />
      </div>
    )
  }
}

export default connect(
  state => ({}),
  {}
)(_FiltersContainer)
