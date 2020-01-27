import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import {
  fetchAddItem,
  FetchAddItemActionCreator,
  fetchLogOut,
  FetchLogOutActionCreator,
  fetchRefreshTransactions,
  FetchRefreshTransactionsActionCreator,
} from '../actions'
import { AddNewItem } from '../components/AddNewItem'
import { Button } from '../components/common/Button'
import { RefreshData } from '../components/RefreshData'
import { USER_NAME } from '../konstants'
import { itemsWithCardsSelector, ItemWithCards, RootState } from '../reducers'
import { isTransactionsRefreshingSelector } from '../reducers/loading'
import { loggedInSelector, User, userSelector } from '../reducers/login'

interface HeaderContainerProps extends RouteComponentProps {

  cardsByItems: ItemWithCards[]
  fetchAddItemAction: FetchAddItemActionCreator
  fetchLogOutAction: FetchLogOutActionCreator
  fetchRefreshTransactionsAction: FetchRefreshTransactionsActionCreator
  isTransactionsRefreshing: boolean
  loggedIn: boolean
  user: User
}

class _HeaderContainer extends Component<HeaderContainerProps> {
  public render() {
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
              <div className="home-page-button-bar">
                <Button
                  type="normal"
                  disabled={false}
                  text="Log In"
                  onClick={() => history.push('/login')}
                  style={{ marginRight: '5px', marginBottom: '0px' }}
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
