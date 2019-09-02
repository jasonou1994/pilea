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

    console.log(user)
    return (
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        {loggedIn ? (
          <>
            <button onClick={() => fetchLogOutAction({})}>Log Out</button>
            <div>{`Welcome, ${user[USER_NAME]}`}</div>
          </>
        ) : null}
        <Breadcrumb />
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
