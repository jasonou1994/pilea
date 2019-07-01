import React, { Component } from 'react'
import { connect } from 'react-redux'

interface CurrentItemsProps {}

interface CurrentItemsState {}

export class CurrentItems extends Component<
  CurrentItemsProps,
  CurrentItemsState
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
        App
      </div>
    )
  }
}
