import { Store } from 'redux'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import rootReducer from '../../js/reducers'
import saga from '../../js/sagas/sagas'
import { composeWithDevTools } from 'redux-devtools-extension'

export const integrationSetup: () => {
  store: Store
  asyncFlush: () => Promise<void>
} = () => {
  const sagaMiddleware = createSagaMiddleware()

  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware))
  )

  let sagaFinished = sagaMiddleware.run(saga).done

  const asyncFlush = async () => {
    store.dispatch(END)
    await sagaFinished
    sagaFinished = sagaMiddleware.run(saga).done
  }

  return {
    store,
    asyncFlush,
  }
}
