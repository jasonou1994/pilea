import React, { Component } from 'react'
import { connect } from 'react-redux'
import ItemsContainer from '../containers/ItemsContainer'
import FiltersContainer from '../containers/FiltersContainer'
import AnalysisContainer from '../containers/AnalysisContainer'
import '../../scss/index.scss'
import {
  NotificationsContainer,
  NotificationWithDuration,
} from './common/NotificationsContainer'

interface MainViewProps {
  isTransactionsLoading: boolean
}

interface MainViewState {}

export class MainView extends Component<MainViewProps, MainViewState> {
  render() {
    const { isTransactionsLoading } = this.props
    const notifications: NotificationWithDuration[] = [
      {
        timeCreated: Date.now(),
        durationInSeconds: 300,
        durationType: 'temporary',
        id: '1',
        success: true,
        title: 'title',
        message: 'message one',
      },
      {
        timeCreated: Date.now(),
        durationType: 'temporary',
        durationInSeconds: 100,
        id: '2',
        success: true,
        title: 'title',
        message: 'message two',
      },
      {
        timeCreated: Date.now(),
        durationType: 'temporary',
        durationInSeconds: 50,
        id: '3',
        success: false,
        title: 'title',
        message: 'the quick brown fox jumps over the lazy dog',
      },
    ]
    const onExpireHandler = (notifs: NotificationWithDuration[]) =>
      console.log(notifs)

    return (
      <div>
        <NotificationsContainer {...{ notifications, onExpireHandler }} />
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
