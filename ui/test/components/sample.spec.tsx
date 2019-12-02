import React from 'react'
import { Store } from 'redux'
import { mount, ReactWrapper } from 'enzyme'
import { Provider } from 'react-redux'
import { History } from 'history'
import { ConnectedRouter } from 'connected-react-router'
import App from '../../src/js/containers/App'
import { integrationSetup } from '../setup/integrationSetup'

describe('Sample test group', () => {
  let store: Store,
    sagaFinished: Promise<any>,
    restartSaga: () => void,
    wrapper: ReactWrapper,
    history: History

  beforeEach(() => {
    ;({ store, sagaFinished, restartSaga, history } = integrationSetup())

    wrapper = mount(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
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
