import React, { FunctionComponent, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { fetchCreateUser } from '../actions'
import { Button } from './common/Button'
import { TextInput } from './common/TextInput'

interface CreateUserState {
  passwordInput: string
  passwordInputValid: boolean
  passwordMatch: boolean
  passwordRepeat: string
  userInput: string
  userInputValid: boolean
}

const emailRegex = /^[a-z].*@.+\.[a-z]+/i

export const CreateUser: FunctionComponent = () => {
  const [state, setState] = useState<CreateUserState>({
    userInput: '',
    passwordInput: '',
    passwordRepeat: '',
    userInputValid: true,
    passwordInputValid: true,
    passwordMatch: true,
  })
  const dispatch = useDispatch()
  const history = useHistory()

  const {
    userInput,
    passwordInput,
    userInputValid,
    passwordMatch,
    passwordInputValid,
    passwordRepeat,
  } = state

  const submitCreateAccount = () =>
    dispatch(
      fetchCreateUser({
        user: userInput,
        password: passwordInput,
      })
    )

  const updateFirstPassword = (input: string) => {
    const isValidPassword = input.length >= 8
    setState({
      ...state,
      passwordInput: input,
      passwordInputValid: isValidPassword,
    })
  }

  const updateSecondPassword = (input: string) =>
    setState({
      ...state,
      passwordRepeat: input,
      passwordMatch: passwordInput === input,
    })

  const updateUserInput = (input: string) =>
    setState({
      ...state,
      userInput: input,
      userInputValid: input.match(emailRegex) !== null,
    })

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
        onChange={updateUserInput}
      />

      <TextInput
        id="new-account-password-1"
        label="Enter password (8 char min)"
        invalid={!passwordInputValid}
        type="password"
        placeholder="Password"
        value={passwordInput}
        onChange={updateFirstPassword}
      />

      <TextInput
        id="new-account-password-2"
        label="Re-enter password"
        invalid={!passwordMatch}
        type="password"
        placeholder="Password"
        value={passwordRepeat}
        onChange={updateSecondPassword}
      />

      <Button
        id="new-account-button"
        onClick={() => {
          submitCreateAccount()
          history.push('/view/accounts')
        }}
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
