import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import HeaderContainer from './HeaderContainer'
import LogInContainer from './LogInContainer'
import PasswordResetContainer from './PasswordResetContainer'
import { MainView } from '../components/MainView'
import { RootState, ItemWithCards, itemsWithCardsSelector } from '../reducers'
import '../../scss/index.scss'
import {
  expireNotifications,
  ExpireNotificationsActionCreator,
  FetchGetHistoricalBalancesActionCreator,
  fetchGetHistoricalBalances,
} from '../actions'
import {
  NotificationsContainer,
  NotificationWithDuration,
} from '../components/NotificationsContainer'
import { loggedInSelector } from '../reducers/login'
import { isTransactionsLoadingSelector } from '../reducers/loading'
import { activeNotificationsSelector } from '../reducers/notifications'

interface AppProps {
  loggedIn: boolean
  isTransactionsLoading: boolean
  activeNotifications: NotificationWithDuration[]
  expireNotificationsAction: ExpireNotificationsActionCreator
  fetchGetHistoricalBalancesAction: FetchGetHistoricalBalancesActionCreator
  cardsByItems: ItemWithCards[]
}

class _App extends Component<AppProps> {
  render() {
    const {
      loggedIn,
      isTransactionsLoading,
      activeNotifications,
      expireNotificationsAction,
      fetchGetHistoricalBalancesAction,
      cardsByItems,
    } = this.props

    return (
      <>
        <NotificationsContainer
          {...{
            notifications: activeNotifications,
            onExpireHandler: (notifications: NotificationWithDuration[]) =>
              expireNotificationsAction({ notifications }),
          }}
        />
        <Router>
          <Route path="/confirmed">
            <>
              <div>Thanks for confirming your email!</div>
              <Link to="/">Please sign in.</Link>
            </>
          </Route>
          <Route path="/password">
            <PasswordResetContainer />
          </Route>
          <Route
            exact
            path="(/|/view|/view/accounts|/view/transactions|/view/pivot)"
          >
            <HeaderContainer />

            {!loggedIn ? (
              <LogInContainer />
            ) : (
              <MainView
                {...{
                  isTransactionsLoading,
                  fetchGetHistoricalBalancesAction,
                  cardsByItems,
                }}
              />
            )}
          </Route>
        </Router>
      </>
    )
  }
}

export default connect(
  (state: RootState) => ({
    loggedIn: loggedInSelector(state),
    isTransactionsLoading: isTransactionsLoadingSelector(state),
    activeNotifications: activeNotificationsSelector(state),
    cardsByItems: itemsWithCardsSelector(state),
  }),
  {
    expireNotificationsAction: expireNotifications,
    fetchGetHistoricalBalancesAction: fetchGetHistoricalBalances,
  }
)(_App)
