import React, { Component } from 'react'
import { FetchSendPasswordResetEmailActionCreator } from '../actions'
import { TextInput } from './common/TextInput'
import { Button } from './common/Button'

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
            <TextInput
              id="password-reset-email-input"
              invalid={false}
              type="text"
              value={emailInput}
              placeholder="Email"
              onChange={userInput => {
                this.setState({ emailInput: userInput })
              }}
            />
            <Button
              id="password-reset-email-button"
              onClick={this.submit}
              text="Send Email"
              type="normal"
              disabled={false}
            />
          </>
        ) : (
          <div>If email exists, password reset link will be sent.</div>
        )}
      </div>
    )
  }
}
