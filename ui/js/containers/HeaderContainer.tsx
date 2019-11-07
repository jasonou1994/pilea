import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Breadcrumb } from '../components/Breadcrumb'
import { RootState, loggedInSelector, userSelector } from '../reducers'
import { fetchLogOut, FetchLogOutActionCreator } from '../actions'
import { USER_ID, USER_NAME } from '../konstants'

interface HeaderContainerProps {
  fetchLogOutAction: FetchLogOutActionCreator
  loggedIn: boolean
  user: {
    [USER_ID]: string
    [USER_NAME]: string
  }
}

class _HeaderContainer extends Component<HeaderContainerProps> {
  render() {
    const { fetchLogOutAction, loggedIn, user } = this.props

    return (
      <div>
        {loggedIn ? (
          <div className="welcome-bar">
            <span className="welcome">
              {`Welcome, ${user[USER_NAME]} to `}
              <span className="pilea-logo">PILEA</span>
            </span>
            <button onClick={() => fetchLogOutAction({})}>Log Out</button>
          </div>
        ) : (
          <div className="welcome-bar">
            <span className="welcome">
              {`Welcome to `}
              <span className="pilea-logo">PILEA</span>.
            </span>
          </div>
        )}
      </div>
    )
  }
}

export default connect(
  (state: RootState) => ({
    loggedIn: loggedInSelector(state),
    user: userSelector(state),
  }),
  { fetchLogOutAction: fetchLogOut }
)(_HeaderContainer)
