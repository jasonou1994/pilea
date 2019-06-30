import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addAccount, refreshTransactions, fetchLogOut } from '../actions'
import {
  accountsSelector,
  isLoadingSelector,
  loggedInSelector,
} from '../reducers'

class _App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      PLAID_PUBLIC_KEY: '134893e5d974bced3a52c91e8e6b5a',
      PLAID_ENV: 'development',
    }
  }

  render() {
    return <div>hih</div>
    // return loggedIn ? (
    //   <div>
    //     <PlaidLink
    //       clientName="testApp"
    //       env={'development'}
    //       product={['transactions']}
    //       publicKey={PLAID_PUBLIC_KEY}
    //       onSuccess={addAccount}
    //     >
    //       Add new accounts
    //     </PlaidLink>
    //     {!isLoading ? (
    //       <>
    //         <button onClick={() => refreshTransactions()}>
    //           Refresh Transactions
    //         </button>
    //         <button onClick={() => fetchLogOut()}>Log Out</button>

    //         <LoadingContainer />
    //         <GraphContainer />
    //         <GridContainer />
    //       </>
    //     ) : (
    //       <LoadingContainer />
    //     )}
    //   </div>
    // ) : (
    //   <LogInContainer />
    // )
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
