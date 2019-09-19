import React, { Component } from 'react'
import { connect } from 'react-redux'
import HeaderContainer from './HeaderContainer'
import LogInContainer from './LogInContainer'
import { MainView } from '../components/MainView'
import {
  loggedInSelector,
  RootState,
  isTransactionsLoadingSelector,
} from '../reducers'

interface AppProps {
  loggedIn: boolean
  isTransactionsLoading: boolean
}

class _App extends Component<AppProps> {
  render() {
    const { loggedIn, isTransactionsLoading } = this.props

    return (
      <>
        <HeaderContainer />
        {!loggedIn ? (
          <LogInContainer />
        ) : (
          <MainView {...{ isTransactionsLoading }} />
        )}
      </>
    )
  }
}

export default connect(
  (state: RootState) => ({
    loggedIn: loggedInSelector(state),
    isTransactionsLoading: isTransactionsLoadingSelector(state),
  }),
  {}
)(_App)
