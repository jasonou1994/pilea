import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import {
  fetchSendPasswordResetEmail,
  FetchSendPasswordResetEmailActionCreator,
} from '../actions'
import { ResetPassword } from '../components/ResetPassword'
import { SendReset } from '../components/SendReset'
import { RootState } from '../reducers'

interface Props {
  fetchSendPasswordResetEmailAction: FetchSendPasswordResetEmailActionCreator
}

class _PasswordResetContainer extends Component<Props> {
  public render() {
    const { fetchSendPasswordResetEmailAction } = this.props

    return (
      <Switch>
        <Route path="/password/forgot">
          <SendReset {...{ fetchSendPasswordResetEmailAction }} />
        </Route>
        <Route path="/password/reset/*">
          <ResetPassword />
        </Route>
      </Switch>
    )
  }
}

export default connect((state: RootState) => ({}), {
  fetchSendPasswordResetEmailAction: fetchSendPasswordResetEmail,
})(_PasswordResetContainer)
