import React, { FunctionComponent, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { fetchLogIn } from '../actions'
import { Button } from './common/Button'
import { TextInput } from './common/TextInput'

interface LogInProps {}

export const LogIn: FunctionComponent<LogInProps> = () => {
  const [userInput, setUserInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const history = useHistory()
  const dispatch = useDispatch()

  return (
    <div className="sign-in ">
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
          dispatch(fetchLogIn({ user: userInput, password: passwordInput }))
          history.push('/view/accounts')
        }}
        type="primary"
        disabled={passwordInput.length === 0 || userInput.length === 0}
        text="Log In"
        width={65}
      />

      <Link id="forgot-password-link" to="/password/forgot">
        Forgot password?
      </Link>
    </div>
  )
}
