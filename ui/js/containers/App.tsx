import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import HeaderContainer from './HeaderContainer'
import LogInContainer from './LogInContainer'
import PasswordResetContainer from './PasswordResetContainer'
import { MainView } from '../components/MainView'
import {
  loggedInSelector,
  RootState,
  isTransactionsLoadingSelector,
} from '../reducers'
import '../../scss/index.scss'

interface AppProps {
  loggedIn: boolean
  isTransactionsLoading: boolean
}

class _App extends Component<AppProps> {
  render() {
    const { loggedIn, isTransactionsLoading } = this.props

    return (
      <Router>
        <Route path="/confirmed">
          <>
            <div>Thanks for confirming your email!</div>
            <Link to="/">Please sign in.</Link>
          </>
        </Route>
        <Route path="/password">
          <>
            Reset Container
            <PasswordResetContainer></PasswordResetContainer>
          </>
        </Route>
        <Route exact path="/">
          <HeaderContainer />
          {!loggedIn ? (
            <LogInContainer />
          ) : (
            <MainView {...{ isTransactionsLoading }} />
          )}
        </Route>
      </Router>
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