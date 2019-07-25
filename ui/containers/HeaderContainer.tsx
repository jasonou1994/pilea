import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Breadcrumb } from '../components/Breadcrumb'

interface HeaderContainerProps {}

interface HeaderContainerState {}

class _HeaderContainer extends Component<
  HeaderContainerProps,
  HeaderContainerState
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
        <Breadcrumb />
      </div>
    )
  }
}

export default connect(
  state => ({}),
  {}
)(_HeaderContainer)
