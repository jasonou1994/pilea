import React from 'react'
import App from '../../js/containers/App'
import {
  VALID_USER,
  VALID_PASS,
  NEW_USER_EMAIL,
  NEW_USER_PASSWORD,
  API_HOST,
  API_PORT,
  API_PROTOCOL,
} from '../constants'
import {
  render,
  cleanup,
  Matcher,
  SelectorMatcherOptions,
  fireEvent,
  wait,
} from '../setup/testUtils'
import { dbClient } from '../database'

let getById: (text: any, options?: any) => HTMLElement
let getByText: (text: Matcher, options?: SelectorMatcherOptions) => HTMLElement
let debug: (
  baseElement?:
    | HTMLElement
    | DocumentFragment
    | Array<HTMLElement | DocumentFragment>
) => void

describe('Log in tests', () => {
  beforeEach(() => {
    ;({ getById, getByText, debug } = render(<App></App>))
  })

  afterEach(cleanup)

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

  test('User creation and password reset flow', async () => {
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
    expect(dbCreateUserCheck.length).toBeGreaterThan(0)

    // Clean up
    await dbClient
      .del()
      .from('users')
      .where({ username: NEW_USER_EMAIL })

    // const button = wrapper.find('#new-account-button').last()
    // expect(button.props().disabled).toBe(false)
    // button.simulate('click')
    // store.dispatch(END)
    // await sagaFinished
    // restartSaga()
    // expect(store.getState().login.loggedIn).toBe(true)
    // await fetch(`${API_PROTOCOL}://${API_HOST}:${API_PORT}/user/admin/delete`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ username: NEW_USER_EMAIL }),
    // })
  })
  // test('Password reset flow', async () => {
  //   // Create User
  //   const userInput = wrapper.find('#new-account-user').last()
  //   userInput.simulate('change', {
  //     target: { value: NEW_USER_EMAIL },
  //   })
  //   expect((userInput.props().value = NEW_USER_EMAIL))
  //   const userPassword1 = wrapper.find('#new-account-password-1').last()
  //   userPassword1.simulate('change', { target: { value: NEW_USER_PASSWORD } })
  //   expect((userPassword1.props().value = NEW_USER_PASSWORD))
  //   const userPassword2 = wrapper.find('#new-account-password-2').last()
  //   userPassword2.simulate('change', { target: { value: NEW_USER_PASSWORD } })
  //   expect((userPassword2.props().value = NEW_USER_PASSWORD))
  //   const button = wrapper.find('#new-account-button').last()
  //   expect(button.props().disabled).toBe(false)
  //   button.simulate('click')
  //   await asyncFlush()
  //   wrapper.update()
  //   expect(store.getState().login.loggedIn).toBe(true)
  //   // Log Out
  //   wrapper
  //     .find('#log-out-button')
  //     .last()
  //     .simulate('click')
  //   await asyncFlush()
  //   wrapper.update()
  //   // Click password reset
  //   wrapper
  //     .find('a')
  //     .findWhere(el => el.props().id === 'forgot-password-link')
  //     .simulate('click', { button: 0 })
  //   const resetEmail = wrapper.find('#password-reset-email-input').last()
  //   resetEmail.simulate('change', {
  //     target: { value: NEW_USER_EMAIL },
  //   })
  //   wrapper
  //     .find('#password-reset-email-button')
  //     .last()
  //     .simulate('click')
  //   await asyncFlush()
  //   wrapper.update()
  //   // console.log(wrapper.debug())
  //   // await setTimeout(() => {}, 3000)
  //   // store.dispatch(END)
  //   // await sagaFinished
  //   // restartSaga()
  //   // Clean up
  //   // await fetch(`${API_PROTOCOL}://${API_HOST}:${API_PORT}/user/admin/delete`, {
  //   //   method: 'POST',
  //   //   headers: {
  //   //     'Content-Type': 'application/json',
  //   //   },
  //   //   body: JSON.stringify({ username: NEW_USER_EMAIL }),
  //   // })
  // })
})
