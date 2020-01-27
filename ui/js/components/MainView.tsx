import React, { FunctionComponent, useEffect } from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, withRouter } from 'react-router-dom'
import {
  fetchTransactionsCount,
  FetchTransactionsCountActionCreator,
} from '../actions'
import AnalysisContainer from '../containers/AnalysisContainer'
import FiltersContainer from '../containers/FiltersContainer'
import ItemsContainer from '../containers/ItemsContainer'
import { PivotContainer } from '../containers/PivotContainer'
import { itemsWithCardsSelector, ItemWithCards, RootState } from '../reducers'
import {
  isLoginLoadingSelector,
  isTransactionsLoadingSelector,
  isTransactionsRefreshingSelector,
} from '../reducers/loading'
import { loggedInSelector } from '../reducers/login'
import { transactionsRefreshedCountSelector } from '../reducers/transactionsAccounts'
import {
  LogInLoading,
  TransactionsLoading,
  TransactionsRefreshing,
} from './common/Loaders'

interface MainViewProps extends RouteComponentProps {
  cardsByItems: ItemWithCards[]
  fetchTransactionsCountAction: FetchTransactionsCountActionCreator
  isLoggedIn: boolean
  isLoginLoading: boolean
  isTransactionsLoading: boolean
  isTransactionsRefreshing: boolean
  refreshedCount: number
}

const _MainView: FunctionComponent<MainViewProps> = ({
  isTransactionsLoading,
  isTransactionsRefreshing,
  history,
  cardsByItems,
  fetchTransactionsCountAction,
  refreshedCount,
  isLoginLoading,
  isLoggedIn,
}) => {
  useEffect(() => {
    if (!isLoggedIn && !isLoginLoading) {
      history.push('/')
    }

    // history.push('/view/accounts')
    return () => {
      history.push('/')
    }
  }, [])

  useEffect(() => {
    // @ts-ignore
    let interval

    if (isTransactionsRefreshing) {
      interval = setInterval(() => {
        fetchTransactionsCountAction()
      }, 3000)
    }

    return () => {
      // @ts-ignore
      clearInterval(interval)
    }
  }, [isTransactionsRefreshing])

  return isLoginLoading ? (
    <LogInLoading />
  ) : isTransactionsLoading ? (
    <TransactionsLoading />
  ) : isTransactionsRefreshing ? (
    <TransactionsRefreshing count={refreshedCount} />
  ) : cardsByItems.length === 0 ? (
    <p>
      Uh oh, you haven't added any active institutions. Please add an
      institution with an active financial product to view data.
    </p>
  ) : (
    <section id="main-view">
      <Route exact path="/view/accounts">
        <ItemsContainer />
      </Route>

      <Route exact path="/view/transactions">
        <div id="filters-analysis">
          <FiltersContainer />
          <AnalysisContainer />
        </div>
      </Route>
      <Route exact path="/view/pivot">
        <PivotContainer />
      </Route>
    </section>
  )
}

export const MainView = withRouter(
  connect(
    (state: RootState) => ({
      isTransactionsLoading: isTransactionsLoadingSelector(state),
      isTransactionsRefreshing: isTransactionsRefreshingSelector(state),
      isLoggedIn: loggedInSelector(state),
      isLoginLoading: isLoginLoadingSelector(state),
      cardsByItems: itemsWithCardsSelector(state),
      refreshedCount: transactionsRefreshedCountSelector(state),
    }),
    {
      fetchTransactionsCountAction: fetchTransactionsCount,
    }
  )(_MainView)
)
