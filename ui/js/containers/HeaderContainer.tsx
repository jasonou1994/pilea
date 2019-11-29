import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  fetchLogOut,
  FetchLogOutActionCreator,
  fetchRefreshTransactions,
  FetchRefreshTransactionsActionCreator,
} from '../actions'
import { USER_ID, USER_NAME } from '../konstants'
import { Button } from '../components/common/Button'
import { RefreshData } from '../components/RefreshData'
import { ItemWithCards, RootState, cardsByItemsSelector } from '../reducers'
import { loggedInSelector, userSelector } from '../reducers/login'

interface HeaderContainerProps {
  fetchLogOutAction: FetchLogOutActionCreator
  fetchRefreshTransactionsAction: FetchRefreshTransactionsActionCreator

  cardsByItems: ItemWithCards[]
  loggedIn: boolean
  user: {
    [USER_ID]: string
    [USER_NAME]: string
  }
}

class _HeaderContainer extends Component<HeaderContainerProps> {
  render() {
    const {
      fetchLogOutAction,
      loggedIn,
      user,
      fetchRefreshTransactionsAction,
      cardsByItems,
    } = this.props

    return (
      <div>
        {loggedIn ? (
          <div className="welcome-bar">
            <span className="welcome">
              {`Welcome, ${user[USER_NAME]} to `}
              <span className="pilea-logo">PILEA</span>
            </span>

            <Button
              type="normal"
              disabled={false}
              text="Log Out"
              onClick={() => fetchLogOutAction({})}
            />
          </div>
        ) : (
          <div className="welcome-bar">
            <span className="welcome">
              {`Welcome to `}
              <span className="pilea-logo">PILEA</span>.
            </span>
          </div>
        )}
        {cardsByItems.length > 0 && (
          <RefreshData
            {...{
              cardsByItems,
              fetchRefreshTransactionsAction,
            }}
          />
        )}
        <hr color="black"></hr>
      </div>
    )
  }
}

export default connect(
  (state: RootState) => ({
    cardsByItems: cardsByItemsSelector(state),
    fetchRefreshTransactionsAction: fetchRefreshTransactions,

    loggedIn: loggedInSelector(state),
    user: userSelector(state),
  }),
  { fetchLogOutAction: fetchLogOut }
)(_HeaderContainer)
