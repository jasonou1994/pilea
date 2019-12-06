import React, { Component } from 'react'
import classNames from 'classnames'
import { FetchCreateUserActionCreator } from '../actions'
import { Button } from './common/Button'
import { TextInput } from './common/TextInput'

interface CreateUserProps {
  fetchCreateUser: FetchCreateUserActionCreator
}

interface CreateUserState {
  userInput: string
  passwordInput: string
  passwordRepeat: string
  userInputValid: boolean
  passwordInputValid: boolean
  passwordMatch: boolean
}

const emailRegex = /^[a-z].*@.+\.[a-z]+/i

export class CreateUser extends Component<CreateUserProps, CreateUserState> {
  constructor(props: CreateUserProps) {
    super(props)
    this.state = {
      userInput: '',
      passwordInput: '',
      passwordRepeat: '',
      userInputValid: true,
      passwordInputValid: true,
      passwordMatch: true,
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

  updateUserInput = (input: string) =>
    this.setState({
      userInput: input,
      userInputValid: input.match(emailRegex) !== null,
    })

  updateFirstPassword = (input: string) => {
    const isValidPassword = input.length >= 8
    this.setState({
      passwordInput: input,
      passwordInputValid: isValidPassword,
    })
  }

  updateSecondPassword = (input: string) =>
    this.setState({
      passwordRepeat: input,
      passwordMatch: this.state.passwordInput === input,
    })

  render() {
    const {
      userInput,
      passwordInput,
      userInputValid,
      passwordMatch,
      passwordInputValid,
      passwordRepeat,
    } = this.state

    return (
      <div className="sign-in right-padding">
        <div className="header">New Account</div>

        <TextInput
          id="new-account-user"
          label="Email address"
          invalid={!userInputValid}
          type="text"
          placeholder="Email"
          value={userInput}
          onChange={this.updateUserInput}
        />

        <TextInput
          id="new-account-password-1"
          label="Enter password (8 char min)"
          invalid={!passwordInputValid}
          type="password"
          placeholder="Password"
          value={passwordInput}
          onChange={this.updateFirstPassword}
        />

        <TextInput
          id="new-account-password-2"
          label="Re-enter password"
          invalid={!passwordMatch}
          type="password"
          placeholder="Password"
          value={passwordRepeat}
          onChange={this.updateSecondPassword}
        />

        <Button
          id="new-account-button"
          onClick={this.submitCreateAccount}
          type="primary"
          disabled={
            !userInputValid ||
            !passwordMatch ||
            !passwordInputValid ||
            passwordRepeat.length === 0 ||
            userInput.length === 0
          }
          text="Create"
          width={65}
        />
      </div>
    )
  }
}
