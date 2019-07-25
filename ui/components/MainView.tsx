import React, { Component } from 'react'
import { connect } from 'react-redux'
import ItemsContainer from '../containers/ItemsContainer'
import FiltersContainer from '../containers/FiltersContainer'
import AnalysisContainer from '../containers/AnalysisContainer'

interface MainViewProps {}

interface MainViewState {}

export class MainView extends Component<MainViewProps, MainViewState> {
  static state = {}

  render() {
    return (
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        <ItemsContainer />
        <FiltersContainer />
        <AnalysisContainer />
      </div>
    )
  }
}
