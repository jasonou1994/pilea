import React, { FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import {
  fetchCreateUser,
  FetchCreateUserActionCreator,
  fetchLogIn,
  FetchLogInActionCreator,
} from '../actions'
import { CreateUser } from '../components/CreateUser'
import { LogIn } from '../components/LogIn'

interface LogInContainerProps {
  fetchCreateUser: FetchCreateUserActionCreator
  fetchLogIn: FetchLogInActionCreator
}

const _LogInContainer: FunctionComponent<LogInContainerProps> = ({
  fetchCreateUser,
  fetchLogIn,
}) => {
  return (
    <>
      <div className="login-container">
        <CreateUser {...{ fetchCreateUser }} />
        <LogIn {...{ fetchLogIn }} />
      </div>
      <Link id="forgot-password-link" to="/password/forgot">
        Forgot password?
      </Link>
    </>
  )
}

export default withRouter(
  connect(() => ({}), {
    fetchLogIn,
    fetchCreateUser,
  })(_LogInContainer)
)
