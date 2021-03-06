// 🐨 you don't need to do anything for the exercise, but there's an extra credit!
import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import * as React from 'react'
import {createRoot} from 'react-dom/client'
import {App} from './app'
import {AppProviders} from 'context'

loadDevTools(() => {
  const root = createRoot(document.getElementById('root'))
  root.render(
    <AppProviders>
      <App />
    </AppProviders>,
  )
})
