import React, { Component } from 'react'
import { connect } from 'react-redux'
import { LogIn } from '../components/LogIn'
import { CreateUser } from '../components/CreateUser'
import {
  fetchLogIn,
  FetchLogInActionCreator,
  fetchCreateUser,
  FetchCreateUserActionCreator,
} from '../actions'

interface LogInContainerProps {
  fetchLogIn: FetchLogInActionCreator
  fetchCreateUser: FetchCreateUserActionCreator
}

class _LogInContainer extends Component<LogInContainerProps> {
  static state = {}

  render() {
    const { fetchLogIn, fetchCreateUser } = this.props

    return (
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        <LogIn {...{ fetchLogIn }} />
        <CreateUser {...{ fetchCreateUser }} />
      </div>
    )
  }
}

export default connect(
  state => ({}),
  {
    fetchLogIn,
    fetchCreateUser,
  }
)(_LogInContainer)
