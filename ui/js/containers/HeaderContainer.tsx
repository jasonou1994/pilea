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
import { USER_NAME } from '../konstants'
import { Button } from '../components/common/Button'
import { RefreshData } from '../components/RefreshData'
import { ItemWithCards, RootState, itemsWithCardsSelector } from '../reducers'
import { loggedInSelector, userSelector, User } from '../reducers/login'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { AddNewItem } from '../components/AddNewItem'
import { isTransactionsRefreshingSelector } from '../reducers/loading'

interface HeaderContainerProps extends RouteComponentProps {
  fetchLogOutAction: FetchLogOutActionCreator
  fetchRefreshTransactionsAction: FetchRefreshTransactionsActionCreator
  fetchAddItemAction: FetchAddItemActionCreator
  isTransactionsRefreshing: boolean

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
      isTransactionsRefreshing,
      history,
    } = this.props

    return (
      <div>
        {loggedIn ? (
          <div className="welcome-bar">
            <span className="welcome">
              {`Welcome, ${user[USER_NAME]} to `}
              <span
                className="pilea-logo"
                onClick={() => history.push('/')}
                style={{ cursor: 'pointer' }}
              >
                PILEA
              </span>
            </span>

            <Button
              id="log-out-button"
              type="normal"
              disabled={false}
              text="Log Out"
              onClick={() => {
                fetchLogOutAction({})
                history.push('/')
              }}
            />
          </div>
        ) : (
          <div className="welcome-bar">
            <span className="welcome">
              {`Welcome to `}
              <span
                className="pilea-logo"
                onClick={() => history.push('/')}
                style={{ cursor: 'pointer' }}
              >
                PILEA
              </span>
              .
            </span>

            {history.location.pathname === '/' && (
              <div>
                <Button
                  type="normal"
                  disabled={false}
                  text="Log In"
                  onClick={() => history.push('/login')}
                  style={{ marginRight: '5px' }}
                />
                <Button
                  type="normal"
                  disabled={false}
                  text="Sign Up"
                  onClick={() => history.push('/signin')}
                />
              </div>
            )}
          </div>
        )}

        {cardsByItems.length > 0 && !isTransactionsRefreshing && (
          <RefreshData
            {...{
              cardsByItems,
              fetchRefreshTransactionsAction,
            }}
          />
        )}

        {loggedIn && (
          <>
            <AddNewItem
              {...{ onConfirm: fetchAddItemAction, hidden: !user.confirmed }}
            />
            <>
              <Link to="/view/accounts">
                <span
                  style={{
                    fontWeight:
                      pathname === '/view/accounts' ? 'bold' : 'normal',
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
    isTransactionsRefreshing: isTransactionsRefreshingSelector(state),
  }),
  {
    fetchAddItemAction: fetchAddItem,
    fetchLogOutAction: fetchLogOut,
    fetchRefreshTransactionsAction: fetchRefreshTransactions,
  }
)(withRouter(_HeaderContainer))
