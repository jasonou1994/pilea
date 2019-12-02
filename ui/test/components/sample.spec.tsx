import React from 'react'
import { Store } from 'redux'
import { mount, ReactWrapper } from 'enzyme'
import { Provider } from 'react-redux'
import App from '../../js/containers/App'
import { integrationSetup } from '../setup/integrationSetup'

describe('Sample test group', () => {
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

  test('sample test', () => {
    const incrementOnClick = wrapper
      .find('#redux-increment')
      .first()
      .props().onClick as () => void
    incrementOnClick()

    expect(Number(wrapper.find('#redux-counter').text())).toEqual(1)
  })
})
