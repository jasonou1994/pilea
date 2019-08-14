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
      <div
        style={{
          border: '1px solid black',
          padding: '5px',
        }}
      >
        CreateUser
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
        <button onClick={this.submitCreateAccount}>Create</button>
      </div>
    )
  }
}
