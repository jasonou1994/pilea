import React, { Component } from 'react'
import { connect } from 'react-redux'

interface AddNewItemProps {}

interface AddNewItemState {}

export class AddNewItem extends Component<AddNewItemProps, AddNewItemState> {
  static state = {}

  render() {
    return (
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        AddNewItem
      </div>
    )
  }
}
