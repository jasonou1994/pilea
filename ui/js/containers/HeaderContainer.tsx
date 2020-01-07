import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  fetchLogOut,
  FetchLogOutActionCreator,
  fetchRefreshTransactions,
  FetchRefreshTransactionsActionCreator,
  FetchAddItemActionCreator,
  fetchAddItem,
} from '../actions'
import { USER_ID, USER_NAME } from '../konstants'
import { Button } from '../components/common/Button'
import { RefreshData } from '../components/RefreshData'
import { ItemWithCards, RootState, itemsWithCardsSelector } from '../reducers'
import { loggedInSelector, userSelector, User } from '../reducers/login'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { AddNewItem } from '../components/AddNewItem'

interface HeaderContainerProps extends RouteComponentProps {
  fetchLogOutAction: FetchLogOutActionCreator
  fetchRefreshTransactionsAction: FetchRefreshTransactionsActionCreator
  fetchAddItemAction: FetchAddItemActionCreator

  cardsByItems: ItemWithCards[]
  loggedIn: boolean
  user: User
}

class _HeaderContainer extends Component<HeaderContainerProps> {
  render() {
    const {
      fetchLogOutAction,
      loggedIn,
      user,
      fetchRefreshTransactionsAction,
      cardsByItems,
      location: { pathname },
      fetchAddItemAction,
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
              id="log-out-button"
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

        {loggedIn && (
          <AddNewItem
            {...{ onConfirm: fetchAddItemAction, hidden: !user.confirmed }}
          />
        )}

        {loggedIn && (
          <>
            <Link to="/view/accounts">
              <span
                style={{
                  fontWeight: pathname === '/view/accounts' ? 'bold' : 'normal',
                }}
              >
                Accounts
              </span>
            </Link>
            <Link to="/view/transactions">
              <span
                style={{
                  fontWeight:
                    pathname === '/view/transactions' ? 'bold' : 'normal',
                }}
              >
                Transactions
              </span>
            </Link>
            <Link to="/view/pivot">
              <span
                style={{
                  fontWeight: pathname === '/view/pivot' ? 'bold' : 'normal',
                }}
              >
                Pivot
              </span>
            </Link>
          </>
        )}

        <hr color="black"></hr>
      </div>
    )
  }
}

export default connect(
  (state: RootState) => ({
    cardsByItems: itemsWithCardsSelector(state),

    loggedIn: loggedInSelector(state),
    user: userSelector(state),
  }),
  {
    fetchAddItemAction: fetchAddItem,
    fetchLogOutAction: fetchLogOut,
    fetchRefreshTransactionsAction: fetchRefreshTransactions,
  }
)(withRouter(_HeaderContainer))
