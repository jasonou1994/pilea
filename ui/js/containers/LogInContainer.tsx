import React, { FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { LogIn } from '../components/LogIn'
import { CreateUser } from '../components/CreateUser'
import {
  fetchLogIn,
  FetchLogInActionCreator,
  fetchCreateUser,
  FetchCreateUserActionCreator,
} from '../actions'
import { Link, withRouter } from 'react-router-dom'

interface LogInContainerProps {
  fetchLogIn: FetchLogInActionCreator
  fetchCreateUser: FetchCreateUserActionCreator
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
