import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FetchLogInActionCreator } from '../actions'
import { Button } from './common/Button'
import { TextInput } from './common/TextInput'

interface LogInProps {
  fetchLogIn: FetchLogInActionCreator
}

interface LogInState {
  userInput: string
  passwordInput: string
}

export class LogIn extends Component<LogInProps, LogInState> {
  constructor(props: LogInProps) {
    super(props)
    this.state = {
      userInput: '',
      passwordInput: '',
    }
  }

  submitLogIn = () => {
    const { userInput, passwordInput } = this.state
    const { fetchLogIn } = this.props

    fetchLogIn({
      user: userInput,
      password: passwordInput,
    })
  }

  render() {
    const { userInput, passwordInput } = this.state

    return (
      <div className="sign-in left-border">
        <div className="header">Sign In</div>

        <TextInput
          label="Username"
          invalid={false}
          type="text"
          placeholder="Username"
          value={userInput}
          onChange={userInput => this.setState({ userInput })}
        />

        <TextInput
          label="Password"
          invalid={false}
          type="password"
          placeholder="Password"
          value={passwordInput}
          onChange={passwordInput => this.setState({ passwordInput })}
        />

        <Button
          onClick={this.submitLogIn}
          type="primary"
          disabled={passwordInput.length === 0 || userInput.length === 0}
          text="Log In"
          width={65}
        />
      </div>
    )
  }
}
