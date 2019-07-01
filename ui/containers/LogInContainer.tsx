import React, { Component } from 'react'
import { connect } from 'react-redux'
import { LogIn } from '../components/LogIn'
import { CreateUser } from '../components/CreateUser'

interface LogInContainerProps {}

interface LogInContainerState {}

class _LogInContainer extends Component<
  LogInContainerProps,
  LogInContainerState
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
        LogInContainer
        <LogIn />
        <CreateUser />
      </div>
    )
  }
}

export default connect(
  state => ({}),
  {}
)(_LogInContainer)
