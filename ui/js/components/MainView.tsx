import React, { FunctionComponent, useEffect } from 'react'
import { withRouter, RouteComponentProps, Route } from 'react-router-dom'
import ItemsContainer from '../containers/ItemsContainer'
import FiltersContainer from '../containers/FiltersContainer'
import AnalysisContainer from '../containers/AnalysisContainer'
import { PivotContainer } from '../containers/PivotContainer'
import {
  FetchTransactionsCountActionCreator,
  fetchTransactionsCount,
} from '../actions'
import { ItemWithCards, RootState, itemsWithCardsSelector } from '../reducers'
import { connect } from 'react-redux'
import {
  isTransactionsLoadingSelector,
  isTransactionsRefreshingSelector,
  isLoginLoadingSelector,
} from '../reducers/loading'
import { transactionsRefreshedCountSelector } from '../reducers/transactionsAccounts'
import {
  TransactionsLoading,
  TransactionsRefreshing,
  LogInLoading,
} from './common/Loaders'
import { loggedInSelector } from '../reducers/login'

interface MainViewProps extends RouteComponentProps {
  isLoginLoading: boolean
  isTransactionsLoading: boolean
  isTransactionsRefreshing: boolean
  cardsByItems: ItemWithCards[]
  fetchTransactionsCountAction: FetchTransactionsCountActionCreator
  refreshedCount: number
  isLoggedIn: boolean
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
