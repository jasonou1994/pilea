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
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        LogIn
        <input
          type="text"
          value={userInput}
          placeholder="Username"
          onChange={e => {
            this.setState({ userInput: e.target.value })
          }}
        />
        <input
          type="text"
          value={passwordInput}
          placeholder="Password"
          onChange={e => {
            this.setState({ passwordInput: e.target.value })
          }}
        />
        <button onClick={this.submitLogIn}>Log In</button>
      </div>
    )
  }
}
