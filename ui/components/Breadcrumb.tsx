import React, { Component } from 'react'
import { connect } from 'react-redux'

interface BreadcrumbProps {}

interface BreadcrumbState {}

export class Breadcrumb extends Component<BreadcrumbProps, BreadcrumbState> {
  static state = {}

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
