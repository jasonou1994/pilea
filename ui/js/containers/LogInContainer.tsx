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

import { Link } from 'react-router-dom'
import { RootState } from '../reducers'
import { isLoginLoadingSelector } from '../reducers/loading'
import { LogInLoading } from '../components/common/Loaders'

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
          <LogInLoading />
        ) : (
          <div>
            <div className="login-container">
              <CreateUser {...{ fetchCreateUser }} />
              <LogIn {...{ fetchLogIn }} />
            </div>

            <Link id="forgot-password-link" to="/password/forgot">
              Forgot password?
            </Link>
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
