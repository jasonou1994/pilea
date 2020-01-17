import React, { FunctionComponent } from 'react'
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
  fetchTransactionsCount,
  FetchTransactionsCountActionCreator,
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
  activeNotifications: NotificationWithDuration[]
  expireNotificationsAction: ExpireNotificationsActionCreator
}

const _App: FunctionComponent<AppProps> = ({
  loggedIn,
  activeNotifications,
  expireNotificationsAction,
}) => {
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

          {!loggedIn ? <LogInContainer /> : <MainView />}
        </Route>
      </Router>
    </>
  )
}

export default connect(
  (state: RootState) => ({
    loggedIn: loggedInSelector(state),
    activeNotifications: activeNotificationsSelector(state),
  }),
  {
    expireNotificationsAction: expireNotifications,
  }
)(_App)
