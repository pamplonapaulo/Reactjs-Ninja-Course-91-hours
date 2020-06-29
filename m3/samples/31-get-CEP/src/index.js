'use strict'

import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import App from './app'
import reducer from 'reducers'

/*
const initialState = {
  todos: [{
    text: 'auto',
    id: '123',
    completed: true
  }],

  address: {
    address: 'Rua Jorge Barbieri',
    city: 'São Paulo',
    state: 'SP',
    code: '55555-000',
    district: 'Perdizes',
    status: 200
  }
}
const store = createStore(reducer, initialState)
*/

const logger = ({ dispatch, getState }) => (next) => (action) => {
  console.log('LOGGER::will dispatch: ', action)

  setTimeout(() => {
    console.log('after 3 seconds...')
    const nextAction = next(action)
    console.log('LOGGER::next action: ', nextAction)
    return next(action)
  }, 3000)
}
const store = createStore(reducer, applyMiddleware(logger))

const renderState = () => {
  console.log('state:', store.getState())
}

store.subscribe(renderState)

const renderApp = (NextApp) => {
  render(
    <AppContainer>
      <Provider store={store}>
        <NextApp />
      </Provider>
    </AppContainer>,
    document.querySelector('[data-js="app"]')
  )
}

renderApp(App)

if (module.hot) {
  module.hot.accept('./app', () => {
    const NextApp = require('./app').default
    renderApp(NextApp)
  })

  module.hot.accept('reducers', () => {
    const nextReducers = require('reducers').default
    store.replaceReducer(nextReducers)
  })
}
