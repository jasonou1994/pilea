import React, { Component } from 'react'
import { connect } from 'react-redux'

interface LogInProps {}

interface LogInState {}

export class LogIn extends Component<LogInProps, LogInState> {
  static state = {}

  render() {
    return (
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        LogIn
      </div>
    )
  }
}
