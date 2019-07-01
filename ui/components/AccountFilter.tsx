import React, { Component } from 'react'
import { connect } from 'react-redux'

interface AccountFilterProps {}

interface AccountFilterState {}

export class AccountFilter extends Component<
  AccountFilterProps,
  AccountFilterState
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
        AccountFilter
      </div>
    )
  }
}
