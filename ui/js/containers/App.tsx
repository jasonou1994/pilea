import React, { FunctionComponent, useEffect } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import '../../scss/index.scss'
import {
  expireNotifications,
  ExpireNotificationsActionCreator,
  fetchLogOut,
  FetchLogOutActionCreator,
} from '../actions'
import { HomePageText } from '../components/HomePageText'
import { IdleWarning } from '../components/IdleWarning'
import { MainView } from '../components/MainView'
import {
  NotificationsContainer,
  NotificationWithDuration,
} from '../components/NotificationsContainer'
import { RootState } from '../reducers'
import { loggedInSelector } from '../reducers/login'
import { activeNotificationsSelector } from '../reducers/notifications'
import { useActiveUser } from '../utilities/hooks'
import HeaderContainer from './HeaderContainer'
import LogInContainer from './LogInContainer'
import PasswordResetContainer from './PasswordResetContainer'

interface AppProps {
  activeNotifications: NotificationWithDuration[]
  expireNotificationsAction: ExpireNotificationsActionCreator
  fetchLogOutAction: FetchLogOutActionCreator
  loggedIn: boolean
}

const _App: FunctionComponent<AppProps> = ({
  loggedIn,
  activeNotifications,
  expireNotificationsAction,
  fetchLogOutAction,
}) => {
  const { isWarning, isLogout, setWarning, setLogout } = useActiveUser({
    warningTime: 120000,
    signoutTime: 180000,
  })

  useEffect(() => {
    if (isLogout) {
      location.reload()
    }
  }, [isLogout])

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
        <HeaderContainer />
        <Route path="/confirmed">
          <>
            <div>Thanks for confirming your email!</div>
            <Link to="/">Please sign in.</Link>
          </>
        </Route>
        <Route path="/password">
          <PasswordResetContainer />
        </Route>
        <Route path="/login">
          <LogInContainer />
        </Route>
        <Route path="/signin">
          <LogInContainer />
        </Route>
        <Route exact path="/">
          <HomePageText />
        </Route>

        <Route
          exact
          path="(/view|/view/accounts|/view/transactions|/view/pivot)"
        >
          {isWarning ? (
            <IdleWarning
              {...{
                onRemainClick: () => {
                  setWarning(false)
                },
                onLogOutClick: () => {
                  setLogout(true)
                  fetchLogOutAction({})
                },
              }}
            />
          ) : (
            <>
              <MainView />
            </>
          )}
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
    fetchLogOutAction: fetchLogOut,
  }
)(_App)
