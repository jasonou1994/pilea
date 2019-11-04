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
import { isLoginLoadingSelector, RootState } from '../reducers'
import { Link } from 'react-router-dom'

interface LogInContainerProps {
  fetchLogIn: FetchLogInActionCreator
  fetchCreateUser: FetchCreateUserActionCreator
  isLoginLoading: boolean
}

class _LogInContainer extends Component<LogInContainerProps> {
  render() {
    const { fetchLogIn, fetchCreateUser, isLoginLoading } = this.props

    return (
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        {isLoginLoading ? (
          <div style={{ color: 'blue', border: '1px solid blue' }}>
            Logging in...
          </div>
        ) : (
          <>
            <LogIn {...{ fetchLogIn }} />
            <CreateUser {...{ fetchCreateUser }} />
            <Link to="/password/forgot">Forgot password?</Link>
          </>
        )}
      </div>
    )
  }
}

export default connect(
  (state: RootState) => ({
    isLoginLoading: isLoginLoadingSelector(state),
  }),
  {
    fetchLogIn,
    fetchCreateUser,
  }
)(_LogInContainer)
