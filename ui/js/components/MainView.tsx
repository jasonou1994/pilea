import React, { FunctionComponent, useEffect } from 'react'
import { withRouter, RouteComponentProps, Route } from 'react-router-dom'
import ItemsContainer from '../containers/ItemsContainer'
import FiltersContainer from '../containers/FiltersContainer'
import AnalysisContainer from '../containers/AnalysisContainer'
import { PivotContainer } from '../containers/PivotContainer'
import { FetchGetHistoricalBalancesActionCreator } from '../actions'
import { ItemWithCards } from '../reducers'

interface MainViewProps extends RouteComponentProps {
  isTransactionsLoading: boolean
  fetchGetHistoricalBalancesAction: FetchGetHistoricalBalancesActionCreator
  cardsByItems: ItemWithCards[]
}

const _MainView: FunctionComponent<MainViewProps> = ({
  isTransactionsLoading,
  history,
  cardsByItems,
}) => {
  useEffect(() => {
    history.push('/view/accounts')
    return () => {
      history.push('/')
    }
  }, [])

  return isTransactionsLoading ? (
    <div style={{ color: 'blue', border: '1px solid blue' }}>
      Loading transactions and account data...
    </div>
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

export const MainView = withRouter(_MainView)
