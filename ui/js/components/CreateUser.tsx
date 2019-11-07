import React, { Component } from 'react'
import { FetchCreateUserActionCreator } from '../actions'

interface CreateUserProps {
  fetchCreateUser: FetchCreateUserActionCreator
}

interface CreateUserState {
  userInput: string
  passwordInput: string
}

export class CreateUser extends Component<CreateUserProps, CreateUserState> {
  constructor(props: CreateUserProps) {
    super(props)
    this.state = {
      userInput: '',
      passwordInput: '',
    }
  }

  submitCreateAccount = () => {
    const { userInput, passwordInput } = this.state
    const { fetchCreateUser } = this.props

    fetchCreateUser({
      user: userInput,
      password: passwordInput,
    })
  }

  render() {
    const { userInput, passwordInput } = this.state

    return (
      <div className="sign-in right-padding">
        <div className="header">New Account</div>
        <div className="input-group">
          <span>Email address</span>
          <input
            type="text"
            value={userInput}
            placeholder="Email"
            onChange={e => {
              this.setState({ userInput: e.target.value })
            }}
          />
        </div>
        <div className="input-group">
          <span>Enter password</span>
          <input
            type="text"
            value={passwordInput}
            placeholder="Password"
            onChange={e => {
              this.setState({ passwordInput: e.target.value })
            }}
          />
        </div>

        <div className="input-group">
          <span>Re-enter password</span>
          <input
            type="text"
            value={passwordInput}
            placeholder="Password"
            onChange={e => {
              this.setState({ passwordInput: e.target.value })
            }}
          />
        </div>

        <button style={{ width: '60px' }} onClick={this.submitCreateAccount}>
          Create
        </button>
      </div>
    )
  }
}
