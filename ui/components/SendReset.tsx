import React, { Component } from 'react'
import {
  FetchLogInActionCreator,
  FetchSendPasswordResetEmailActionCreator,
} from '../actions'

interface Props {
  fetchSendPasswordResetEmailAction: FetchSendPasswordResetEmailActionCreator
}

interface State {
  emailInput: string
  sent: boolean
}

export class SendReset extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      emailInput: '',
      sent: false,
    }
  }

  submit = () => {
    const { emailInput } = this.state
    const { fetchSendPasswordResetEmailAction } = this.props

    fetchSendPasswordResetEmailAction({
      email: emailInput,
    })
    this.setState({ sent: true })
  }

  render() {
    const { emailInput, sent } = this.state

    return (
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        {!sent ? (
          <>
            Send password reset email:
            <input
              type="text"
              value={emailInput}
              placeholder="Email"
              onChange={e => {
                this.setState({ emailInput: e.target.value })
              }}
            />
            <button onClick={this.submit}>Send email</button>
          </>
        ) : (
          <div>If email exists, password reset link will be sent.</div>
        )}
      </div>
    )
  }
}
