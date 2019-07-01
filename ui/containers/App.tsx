import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addAccount, refreshTransactions, fetchLogOut } from '../actions'
import {
  accountsSelector,
  isLoadingSelector,
  loggedInSelector,
} from '../reducers'
import HeaderContainer from './HeaderContainer'
import LogInContainer from './LogInContainer'
import { MainView } from '../components/MainView'

class _App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      PLAID_PUBLIC_KEY: '134893e5d974bced3a52c91e8e6b5a',
      PLAID_ENV: 'development',
    }
  }

  render() {
    return (
      <div>
        <HeaderContainer />
        <LogInContainer />
        <MainView />
      </div>
    )
  }
}

export default connect(
  state => ({
    accounts: accountsSelector(state),
    isLoading: isLoadingSelector(state),
    loggedIn: loggedInSelector(state),
  }),
  dispatch => ({
    refreshTransactions: () => dispatch(refreshTransactions({})),
    addAccount: token => dispatch(addAccount(token)),
    fetchLogOut: () => dispatch(fetchLogOut({})),
  })
)(_App)
