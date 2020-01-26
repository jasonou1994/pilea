import React, { FunctionComponent, useState } from 'react'
import { FetchLogInActionCreator } from '../actions'
import { Button } from './common/Button'
import { TextInput } from './common/TextInput'
import { useHistory } from 'react-router-dom'

interface LogInProps {
  fetchLogIn: FetchLogInActionCreator
}

export const LogIn: FunctionComponent<LogInProps> = ({ fetchLogIn }) => {
  const [userInput, setUserInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const history = useHistory()

  return (
    <div className="sign-in left-border">
      <div className="header">Sign In</div>

      <TextInput
        id="sign-in-user"
        label="Username"
        invalid={false}
        type="text"
        placeholder="Username"
        value={userInput}
        onChange={userInput => setUserInput(userInput)}
      />

      <TextInput
        id="sign-in-password"
        label="Password"
        invalid={false}
        type="password"
        placeholder="Password"
        value={passwordInput}
        onChange={passwordInput => setPasswordInput(passwordInput)}
      />

      <Button
        id="sign-in-button"
        onClick={() => {
          fetchLogIn({ user: userInput, password: passwordInput })
          history.push('/view/accounts')
        }}
        type="primary"
        disabled={passwordInput.length === 0 || userInput.length === 0}
        text="Log In"
        width={65}
      />
    </div>
  )
}
