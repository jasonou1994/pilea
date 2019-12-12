import React, { SFC, useState, useEffect } from 'react'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'

// @ts-ignore
const API_PORT = env.API_PORT
// @ts-ignore
const API_HOST = env.API_HOST
// @ts-ignore
const API_PROTOCOL = env.API_PROTOCOL

interface Props {}

export const ResetPassword: SFC<Props> = () => {
  const [firstPassword, setFirstPassword] = useState('')
  const [secondPassword, setSecondPassword] = useState('')
  const [passwordMatch, setPasswordMatch] = useState(false)
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>(
    'pending'
  )

  useEffect(() => {
    setPasswordMatch(firstPassword === secondPassword && firstPassword !== '')
  }, [firstPassword, secondPassword])

  const { pathname } = useLocation()

  const submitNewPassword = async () => {
    const passwordToken = pathname.replace('/password/reset/', '')
    const rawResult = await fetch(
      `${API_PROTOCOL}://${API_HOST}:${API_PORT}/user/password/reset/${passwordToken}`,
      {
        method: 'POST',
        body: JSON.stringify({ password: firstPassword }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    )

    const { success } = await rawResult.json()

    if (success) {
      setStatus('success')
    } else {
      setStatus('failed')
    }
  }

  return (
    <div>
      {status === 'pending' ? (
        <>
          <input
            type="text"
            value={firstPassword}
            placeholder="Enter a new password"
            onChange={e => {
              setFirstPassword(e.target.value)
            }}
          />
          <input
            type="text"
            value={secondPassword}
            placeholder="Reenter"
            onChange={e => {
              setSecondPassword(e.target.value)
            }}
          />
          {passwordMatch && <button onClick={submitNewPassword}>Submit</button>}
        </>
      ) : status === 'success' ? (
        <div>Password change success.</div>
      ) : (
        <div>Password change fail.</div>
      )}
      <Link to="/">Go Home</Link>
    </div>
  )
}
