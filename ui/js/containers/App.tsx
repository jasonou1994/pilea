import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import HeaderContainer from './HeaderContainer'
import LogInContainer from './LogInContainer'
import PasswordResetContainer from './PasswordResetContainer'
import { MainView } from '../components/MainView'
import {
  loggedInSelector,
  RootState,
  isTransactionsLoadingSelector,
  activeNotificationsSelector,
} from '../reducers'
import '../../scss/index.scss'
import {
  expireNotifications,
  ExpireNotificationsActionCreator,
} from '../actions'
import {
  NotificationsContainer,
  NotificationWithDuration,
} from '../components/common/NotificationsContainer'

interface AppProps {
  loggedIn: boolean
  isTransactionsLoading: boolean
  activeNotifications: NotificationWithDuration[]
  expireNotificationsAction: ExpireNotificationsActionCreator
}

class _App extends Component<AppProps> {
  render() {
    const {
      loggedIn,
      isTransactionsLoading,
      activeNotifications,
      expireNotificationsAction,
    } = this.props

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
          <NotificationsContainer
            {...{
              notifications: activeNotifications,
              onExpireHandler: (notifications: NotificationWithDuration[]) =>
                expireNotificationsAction({ notifications }),
            }}
          ></NotificationsContainer>
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
    activeNotifications: activeNotificationsSelector(state),
  }),
  {
    expireNotificationsAction: expireNotifications,
  }
)(_App)
