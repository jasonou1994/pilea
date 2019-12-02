import { Store } from 'redux'
import { createStore, applyMiddleware } from 'redux'
import createHistory from 'history/createBrowserHistory'
import { connectRouter } from 'connected-react-router'
import createSagaMiddleware from 'redux-saga'
import { History } from 'history'
import rootReducer from '../../src/js/reducers'
import saga from '../../src/js/sagas'

export const integrationSetup: () => {
  store: Store
  sagaFinished: Promise<any>
  restartSaga: () => void
  history: History<any>
} = () => {
  const sagaMiddleware = createSagaMiddleware()
  const history = createHistory()
  const store = createStore(
    connectRouter(history)(rootReducer),
    applyMiddleware(sagaMiddleware)
  )
  const sagaFinished = sagaMiddleware.run(saga).toPromise()
  const restartSaga = () => sagaMiddleware.run(saga)

  return {
    store,
    sagaFinished,
    restartSaga,
    history,
  }
}
