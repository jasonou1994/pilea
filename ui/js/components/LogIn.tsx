import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FetchLogInActionCreator } from '../actions'

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
        <div className="input-group">
          <span>Username</span>
          <input
            type="text"
            value={userInput}
            placeholder="Username"
            onChange={e => {
              this.setState({ userInput: e.target.value })
            }}
          />
        </div>

        <div className="input-group">
          <span>Password</span>
          <input
            type="text"
            value={passwordInput}
            placeholder="Password"
            onChange={e => {
              this.setState({ passwordInput: e.target.value })
            }}
          />
        </div>
        <button style={{ width: '60px' }} onClick={this.submitLogIn}>
          Log In
        </button>
      </div>
    )
  }
}
