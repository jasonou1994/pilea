import { Store } from 'redux'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducer from '../../js/reducers'
import saga from '../../js/sagas/sagas'
import { composeWithDevTools } from 'redux-devtools-extension'

export const integrationSetup: () => {
  store: Store
  sagaFinished: Promise<any>
  restartSaga: () => void
} = () => {
  const sagaMiddleware = createSagaMiddleware()

  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware))
  )

  const sagaFinished = sagaMiddleware.run(saga).toPromise()
  const restartSaga = () => sagaMiddleware.run(saga)

  return {
    store,
    sagaFinished,
    restartSaga,
  }
}
