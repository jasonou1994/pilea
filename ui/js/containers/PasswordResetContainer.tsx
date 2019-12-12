import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { RootState } from '../reducers'
import { SendReset } from '../components/SendReset'
import {
  FetchSendPasswordResetEmailActionCreator,
  fetchSendPasswordResetEmail,
} from '../actions'
import { ResetPassword } from '../components/ResetPassword'

interface Props {
  fetchSendPasswordResetEmailAction: FetchSendPasswordResetEmailActionCreator
}

class _PasswordResetContainer extends Component<Props> {
  render() {
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
