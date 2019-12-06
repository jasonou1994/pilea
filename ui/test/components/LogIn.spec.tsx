import React from 'react'
import { Store } from 'redux'
import { mount, ReactWrapper } from 'enzyme'
import { Provider } from 'react-redux'
import App from '../../js/containers/App'
import { integrationSetup } from '../setup/integrationSetup'
import { VALID_USER, VALID_PASS } from '../constants'
import { END } from 'redux-saga'
import { Button } from '../../js/components/common/Button'

describe('Log in tests', () => {
  let store: Store,
    sagaFinished: Promise<any>,
    restartSaga: () => void,
    wrapper: ReactWrapper

  beforeEach(() => {
    ;({ store, sagaFinished, restartSaga } = integrationSetup())

    wrapper = mount(
      <Provider store={store}>
        <App />
      </Provider>
    )
  })

  test('Log in button is disabled without input', () => {
    expect(
      wrapper
        .find('#sign-in-button')
        .last()
        .props().disabled
    ).toBe(true)
  })

  test('Log in button is disabled with only username entered', () => {
    const userInput = wrapper.find('#sign-in-user').last()

    userInput.simulate('change', { target: { value: 'username' } })
    expect((userInput.props().value = 'username'))
    expect(
      wrapper
        .find('#sign-in-button')
        .last()
        .props().disabled
    ).toBe(true)
  })

  test('Log in button is disabled with only password entered', () => {
    const userPassword = wrapper.find('#sign-in-password').last()

    userPassword.simulate('change', { target: { value: 'password' } })
    expect((userPassword.props().value = 'password'))
    expect(
      wrapper
        .find('#sign-in-button')
        .last()
        .props().disabled
    ).toBe(true)
  })

  test('Proper log in flow', async () => {
    const userInput = wrapper.find('#sign-in-user').last()
    userInput.simulate('change', {
      target: { value: VALID_USER },
    })
    expect((userInput.props().value = VALID_USER))

    const userPassword = wrapper.find('#sign-in-password').last()
    userPassword.simulate('change', { target: { value: VALID_PASS } })
    expect((userPassword.props().value = VALID_PASS))

    const button = wrapper.find('#sign-in-button').last()
    expect(button.props().disabled).toBe(false)

    wrapper
      .find(Button)
      .findWhere(el => el.props().id === 'sign-in-button')
      .first()
      .props()
      .onClick()

    store.dispatch(END)
    await sagaFinished
    restartSaga()

    expect(store.getState().login.loggedIn).toBe(true)
    console.log(store.getState())
  })
})
