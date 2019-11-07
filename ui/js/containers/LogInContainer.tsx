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
      <div>
        {isLoginLoading ? (
          <div style={{ color: 'blue', border: '1px solid blue' }}>
            Logging in...
          </div>
        ) : (
          <div>
            <div className="login-container">
              <CreateUser {...{ fetchCreateUser }} />
              <LogIn {...{ fetchLogIn }} />
            </div>

            <Link to="/password/forgot">Forgot password?</Link>
          </div>
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
