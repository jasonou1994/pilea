import React from 'react'
import { Store } from 'redux'
import { mount, ReactWrapper } from 'enzyme'
import { Provider } from 'react-redux'
import App from '../../js/containers/App'
import { integrationSetup } from '../setup/integrationSetup'
import {
  VALID_USER,
  VALID_PASS,
  NEW_USER_EMAIL,
  NEW_USER_PASSWORD,
} from '../constants'
import { END } from 'redux-saga'
import { Button } from '../../js/components/common/Button'
import { Link } from 'react-router-dom'

// @ts-ignore
const API_PORT = env.API_PORT
// @ts-ignore
const API_HOST = env.API_HOST
// @ts-ignore
const API_PROTOCOL = env.API_PROTOCOL

describe('Log in tests', () => {
  let store: Store
  let asyncFlush: () => Promise<void>
  let wrapper: ReactWrapper

  beforeEach(() => {
    ;({ store, asyncFlush } = integrationSetup())

    wrapper = mount(
      <Provider store={store}>
        <App />
      </Provider>
    )
  })

  // test('Log in button is disabled without input', () => {
  //   expect(
  //     wrapper
  //       .find('#sign-in-button')
  //       .last()
  //       .props().disabled
  //   ).toBe(true)
  // })

  // test('Log in button is disabled with only username entered', () => {
  //   const userInput = wrapper.find('#sign-in-user').last()

  //   userInput.simulate('change', { target: { value: 'username' } })
  //   expect((userInput.props().value = 'username'))
  //   expect(
  //     wrapper
  //       .find('#sign-in-button')
  //       .last()
  //       .props().disabled
  //   ).toBe(true)
  // })

  // test('Log in button is disabled with only password entered', () => {
  //   const userPassword = wrapper.find('#sign-in-password').last()

  //   userPassword.simulate('change', { target: { value: 'password' } })
  //   expect((userPassword.props().value = 'password'))
  //   expect(
  //     wrapper
  //       .find('#sign-in-button')
  //       .last()
  //       .props().disabled
  //   ).toBe(true)
  // })

  // test('Create user button is disabled without input', () => {
  //   expect(
  //     wrapper
  //       .find('#new-account-button')
  //       .last()
  //       .props().disabled
  //   ).toBe(true)
  // })

  // test('User account creation flow', async () => {
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

  //   store.dispatch(END)
  //   await sagaFinished
  //   restartSaga()

  //   expect(store.getState().login.loggedIn).toBe(true)

  //   await fetch(`${API_PROTOCOL}://${API_HOST}:${API_PORT}/user/admin/delete`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ username: NEW_USER_EMAIL }),
  //   })
  // })

  // test('Normal log in flow', async () => {
  //   const userInput = wrapper.find('#sign-in-user').last()
  //   userInput.simulate('change', {
  //     target: { value: VALID_USER },
  //   })
  //   expect((userInput.props().value = VALID_USER))

  //   const userPassword = wrapper.find('#sign-in-password').last()
  //   userPassword.simulate('change', { target: { value: VALID_PASS } })
  //   expect((userPassword.props().value = VALID_PASS))

  //   const button = wrapper.find('#sign-in-button').last()
  //   expect(button.props().disabled).toBe(false)

  //   button.simulate('click')

  //   store.dispatch(END)
  //   await sagaFinished
  //   restartSaga()

  //   expect(store.getState().login.loggedIn).toBe(true)
  // })

  test('Password reset flow', async () => {
    // Create User
    const userInput = wrapper.find('#new-account-user').last()
    userInput.simulate('change', {
      target: { value: NEW_USER_EMAIL },
    })
    expect((userInput.props().value = NEW_USER_EMAIL))

    const userPassword1 = wrapper.find('#new-account-password-1').last()
    userPassword1.simulate('change', { target: { value: NEW_USER_PASSWORD } })
    expect((userPassword1.props().value = NEW_USER_PASSWORD))

    const userPassword2 = wrapper.find('#new-account-password-2').last()
    userPassword2.simulate('change', { target: { value: NEW_USER_PASSWORD } })
    expect((userPassword2.props().value = NEW_USER_PASSWORD))

    const button = wrapper.find('#new-account-button').last()
    expect(button.props().disabled).toBe(false)

    button.simulate('click')

    await asyncFlush()
    wrapper.update()

    expect(store.getState().login.loggedIn).toBe(true)

    console.log(wrapper.debug())

    // Log Out
    wrapper
      .find('#log-out-button')
      .last()
      .simulate('click')

    await asyncFlush()
    wrapper.update()

    console.log(wrapper.debug())

    // // Click password reset
    // wrapper
    //   .find('a')
    //   .findWhere(el => el.props().id === 'forgot-password-link')
    //   .simulate('click', { button: 0 })

    // const resetEmail = wrapper.find('#password-reset-email-input').last()
    // resetEmail.simulate('change', {
    //   target: { value: 'jasonou122894@gmail.com' },
    // })
    // console.log(wrapper.debug())

    // wrapper
    //   .find('#password-reset-email-button')
    //   .last()
    //   .simulate('click')

    // console.log(wrapper.debug())

    // await setTimeout(() => {}, 3000)
    // store.dispatch(END)
    // await sagaFinished
    // restartSaga()

    // Clean up
    await fetch(`${API_PROTOCOL}://${API_HOST}:${API_PORT}/user/admin/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: NEW_USER_EMAIL }),
    })
  })
})
