import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import { Board } from './App'
// import { accounts } from "./mockData/setAccounts";
// import { transactions } from "./mockData/setTransactions";

ReactDOM.render(<Board />, document.getElementById('root'))

// store.dispatch(transactions);
// store.dispatch(accounts);
