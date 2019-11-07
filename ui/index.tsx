import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './js/reducers/index'
import saga from './js/sagas/sagas'
import createSagaMiddleware from 'redux-saga'
import App from './js/containers/App'
// import { accounts } from "./mockData/setAccounts";
// import { transactions } from "./mockData/addTransactions";

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
)

sagaMiddleware.run(saga)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

// store.dispatch({
//   type: 'FETCH_LOG_IN',
//   payload: {
//     user: 'jasonou122894@gmail.com',
//     password: 'jasonou1',
//   },
// })

// store.dispatch(transactions);
// store.dispatch(accounts);
