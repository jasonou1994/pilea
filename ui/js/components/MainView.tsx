import React, { Component } from 'react'
import { connect } from 'react-redux'
import ItemsContainer from '../containers/ItemsContainer'
import FiltersContainer from '../containers/FiltersContainer'
import AnalysisContainer from '../containers/AnalysisContainer'
import '../../scss/index.scss'

interface MainViewProps {
  isTransactionsLoading: boolean
}

interface MainViewState {}

export class MainView extends Component<MainViewProps, MainViewState> {
  render() {
    const { isTransactionsLoading } = this.props

    return (
      <div>
        {isTransactionsLoading ? (
          <div style={{ color: 'blue', border: '1px solid blue' }}>
            Loading transactions and account data...
          </div>
        ) : (
          <section id="main-view">
            <ItemsContainer />
            <div id="filters-analysis">
              <FiltersContainer />

              <AnalysisContainer />
            </div>
          </section>
        )}
      </div>
    )
  }
}
