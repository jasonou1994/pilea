import React, { FunctionComponent, useEffect } from 'react'
import { withRouter, RouteComponentProps, Route } from 'react-router-dom'
import ItemsContainer from '../containers/ItemsContainer'
import FiltersContainer from '../containers/FiltersContainer'
import AnalysisContainer from '../containers/AnalysisContainer'

interface MainViewProps extends RouteComponentProps {
  isTransactionsLoading: boolean
}

const _MainView: FunctionComponent<MainViewProps> = ({
  isTransactionsLoading,
  history,
}) => {
  useEffect(() => {
    history.push('/view/transactions')
    return () => {
      history.push('/')
    }
  }, [])

  return (
    <>
      {isTransactionsLoading ? (
        <div style={{ color: 'blue', border: '1px solid blue' }}>
          Loading transactions and account data...
        </div>
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
        </section>
      )}
    </>
  )
}

export const MainView = withRouter(_MainView)
