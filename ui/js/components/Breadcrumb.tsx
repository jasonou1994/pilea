import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FetchLogOutActionCreator } from '../actions'

interface BreadcrumbProps {}

export class Breadcrumb extends Component<BreadcrumbProps> {
  render() {
    return (
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        Breadcrumb
      </div>
    )
  }
}
