import React, { Component } from 'react'
import { connect } from 'react-redux'
import HeaderContainer from './HeaderContainer'
import LogInContainer from './LogInContainer'
import { MainView } from '../components/MainView'
import { loggedInSelector } from '../reducers'

interface AppProps {
  loggedIn: boolean
}

class _App extends Component<AppProps> {
  constructor(props) {
    super(props)
    this.state = {
      PLAID_PUBLIC_KEY: '134893e5d974bced3a52c91e8e6b5a',
      PLAID_ENV: 'development',
    }
  }

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
  state => ({
    loggedIn: loggedInSelector(state),
  }),
  {}
)(_App)
