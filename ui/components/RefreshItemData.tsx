import React, { Component } from 'react'
import { connect } from 'react-redux'

interface RefreshItemDataProps {}

interface RefreshItemDataState {}

export class RefreshItemData extends Component<
  RefreshItemDataProps,
  RefreshItemDataState
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
        RefreshItemData
      </div>
    )
  }
}
