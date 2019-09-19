import React, { Component } from 'react'
import { connect } from 'react-redux'
import ItemsContainer from '../containers/ItemsContainer'
import FiltersContainer from '../containers/FiltersContainer'
import AnalysisContainer from '../containers/AnalysisContainer'

interface MainViewProps {
  isTransactionsLoading: boolean
}

interface MainViewState {}

export class MainView extends Component<MainViewProps, MainViewState> {
  render() {
    const { isTransactionsLoading } = this.props

    return (
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        {isTransactionsLoading ? (
          <div style={{ color: 'blue', border: '1px solid blue' }}>
            Loading transactions and account data...
          </div>
        ) : (
          <>
            <ItemsContainer />
            <FiltersContainer />
            <AnalysisContainer />
          </>
        )}
      </div>
    )
  }
}
