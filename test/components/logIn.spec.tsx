import React from 'react'
import knex from 'knex'
import App from '../../ui/js/containers/App'
import {
  VALID_USER,
  VALID_PASS,
  NEW_USER_EMAIL,
  NEW_USER_PASSWORD,
  API_HOST,
  API_PORT,
  API_PROTOCOL,
  NEW_USER_UPDATED_PASSWORD,
  connection,
} from '../constants'
import {
  render,
  cleanup,
  Matcher,
  SelectorMatcherOptions,
  fireEvent,
  wait,
} from '../setup/testUtils'
// import { dbClient } from '../database'

let getById: (text: any, options?: any) => HTMLElement
let getByText: (text: Matcher, options?: SelectorMatcherOptions) => HTMLElement
export const dbClient = knex({ client: 'pg', connection })

describe('Log in tests', () => {
  beforeEach(() => {
    ;({ getById, getByText } = render(<App></App>))
  })

  afterEach(cleanup)

  afterAll(() => dbClient.destroy())

  test('Log in button is disabled without input', () => {
    const signInButton = getById('sign-in-button') as HTMLButtonElement

    expect(signInButton.disabled).toBe(true)
  })

  test('Log in button is disabled with only username entered', () => {
    const userInput = getById('sign-in-user') as HTMLInputElement
    const signInButton = getById('sign-in-button') as HTMLButtonElement

    fireEvent.change(userInput, { target: { value: 'username' } })

    expect((userInput.value = 'username'))
    expect(signInButton.disabled).toBe(true)
  })

  test('Log in button is disabled with only password entered', () => {
    const passwordInput = getById('sign-in-password') as HTMLInputElement
    const signInButton = getById('sign-in-button') as HTMLButtonElement

    fireEvent.change(passwordInput, { target: { value: 'password' } })

    expect((passwordInput.value = 'password'))
    expect(signInButton.disabled).toBe(true)
  })

  test('Create user button is disabled without input', () => {
    const createUserButton = getById('new-account-button') as HTMLButtonElement

    expect(createUserButton.disabled).toBe(true)
  })

  test('Normal log in flow', async () => {
    const userInput = getById('sign-in-user') as HTMLInputElement
    const passwordInput = getById('sign-in-password') as HTMLInputElement
    const signInButton = getById('sign-in-button') as HTMLButtonElement

    fireEvent.change(userInput, { target: { value: VALID_USER } })
    fireEvent.change(passwordInput, { target: { value: VALID_PASS } })

    expect(signInButton.disabled).toBe(false)

    fireEvent.click(signInButton)

    await wait(() => getByText('Log Out'))

    expect(getByText('Log Out')).toBeTruthy()
  })

  test('User creation, confirmation, and password reset flow', async () => {
    // Prep
    await dbClient
      .del()
      .from('users')
      .where({ username: NEW_USER_EMAIL })

    // Create User
    const userInput = getById('new-account-user') as HTMLInputElement
    const passwordInput1 = getById('new-account-password-1') as HTMLInputElement
    const passwordInput2 = getById('new-account-password-2') as HTMLInputElement
    const createUserButton = getById('new-account-button') as HTMLButtonElement

    fireEvent.change(userInput, { target: { value: NEW_USER_EMAIL } })
    fireEvent.change(passwordInput1, { target: { value: NEW_USER_PASSWORD } })
    fireEvent.change(passwordInput2, { target: { value: NEW_USER_PASSWORD } })

    expect(createUserButton.disabled).toBe(false)

    fireEvent.click(createUserButton)

    await wait(() => getByText('Log Out'))
    expect(getByText('Log Out')).toBeTruthy()

    const dbCreateUserCheck = await dbClient
      .select('*')
      .from('users')
      .where({ username: NEW_USER_EMAIL })
    expect(dbCreateUserCheck.length).toBe(1)

    // Confirm User
    const confirmationString: string = dbCreateUserCheck[0].confirmationString.trim()
    const confirmationURL = `${API_PROTOCOL}://${API_HOST}:${API_PORT}/user/confirm/${confirmationString}`

    await fetch(confirmationURL, {
      redirect: 'manual',
    })

    const dbConfirmationCheck = await dbClient
      .select('confirmed')
      .from('users')
      .where({ username: NEW_USER_EMAIL })
    expect(Boolean(dbConfirmationCheck[0].confirmed)).toBe(true)

    // Log Out
    fireEvent.click(getById('log-out-button'))

    await wait(() => getByText('Forgot password?'))
    expect(getByText('Forgot password?')).toBeTruthy()

    // Reset password
    fireEvent.click(getByText('Forgot password?'))
    fireEvent.change(getById('password-reset-email-input'), {
      target: { value: NEW_USER_EMAIL },
    })
    fireEvent.click(getByText('Send Email'))

    await new Promise(resolve => setTimeout(() => resolve(), 2000))

    const dbResetToken = await dbClient
      .select('passwordResetToken')
      .from('users')
      .where({ username: NEW_USER_EMAIL })
    expect(dbResetToken[0].passwordResetToken).toBeTruthy()

    const resetToken = dbResetToken[0].passwordResetToken
    const resetURL = `${API_PROTOCOL}://${API_HOST}:${API_PORT}/user/password/reset/${resetToken}`

    await fetch(resetURL, {
      body: JSON.stringify({ password: NEW_USER_UPDATED_PASSWORD }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'manual',
    })

    const dbConfirmPasswordUpdate = await dbClient
      .select('passwordResetToken')
      .from('users')
      .where({ username: NEW_USER_EMAIL })
    expect(dbConfirmPasswordUpdate[0].passwordResetToken).toBe('')

    // Clean up
    await dbClient
      .del()
      .from('users')
      .where({ username: NEW_USER_EMAIL })
  }, 10000)
})
