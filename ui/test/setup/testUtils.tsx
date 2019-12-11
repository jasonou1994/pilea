import {
  render,
  RenderOptions,
  queryHelpers,
  buildQueries,
  queries,
} from '@testing-library/react'
import { createStore, applyMiddleware, Store } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'

import rootReducer from '../../js/reducers'
import saga from '../../js/sagas/sagas'
import React from 'react'

const generateReduxStore: () => Store = () => {
  const sagaMiddleware = createSagaMiddleware()

  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware))
  )

  sagaMiddleware.run(saga)

  return store
}

const reduxWrapper = ({ children }: { children: React.ReactElement<any> }) => (
  <Provider store={generateReduxStore()}>{children}</Provider>
)

// @ts-ignore
const queryAllById = (...args) =>
  // @ts-ignore
  queryHelpers.queryAllByAttribute('id', ...args)

const [queryById, getAllById, getById, findAllById, findById] = buildQueries(
  queryAllById,
  (_, value) => `Found multiple elements with id of: ${value}`,
  (_, value) => `Unable to find an element with id of: ${value}`
)

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>
) =>
  render(ui, {
    wrapper: reduxWrapper,
    queries: {
      queryById,
      getAllById,
      getById,
      findAllById,
      findById,
      ...queries,
    },
    ...options,
  })

export * from '@testing-library/react'
export { customRender as render }
