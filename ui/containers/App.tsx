import React, { Component } from 'react'
import { connect } from 'react-redux'
import HeaderContainer from './HeaderContainer'
import LogInContainer from './LogInContainer'
import { MainView } from '../components/MainView'
import { loggedInSelector, RootState } from '../reducers'

interface AppProps {
  loggedIn: boolean
}

class _App extends Component<AppProps> {
  render() {
    const { loggedIn } = this.props

    return (
      <>
        <HeaderContainer />
        {!loggedIn ? <LogInContainer /> : <MainView />}
      </>
    )
  }
}

export default connect(
  (state: RootState) => ({
    loggedIn: loggedInSelector(state),
  }),
  {}
)(_App)
