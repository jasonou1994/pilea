import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import { setCurrentWindowHeight, setCurrentWindowWidth } from './js/actions'
import App from './js/containers/App'
import rootReducer from './js/reducers/index'
import saga from './js/sagas/sagas'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
)

sagaMiddleware.run(saga)

store.dispatch(setCurrentWindowWidth({ width: window.innerWidth }))
store.dispatch(setCurrentWindowHeight({ height: window.innerHeight }))
window.onresize = () => {
  store.dispatch(setCurrentWindowWidth({ width: window.innerWidth }))
  store.dispatch(setCurrentWindowHeight({ height: window.innerHeight }))
}

store.dispatch({
  type: 'FETCH_LOG_IN',
  payload: {
    user: 'jasonou122894@gmail.com',
    password: 'jasonou1',
  },
})

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

//@ts-ignore
module.hot.accept()
