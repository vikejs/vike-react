export default { createStore }
export type AppStore = ReturnType<typeof createStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import counterReducer from '../lib/features/counter/counterSlice'
import type { PageContext } from 'vike/types'
const rootReducer = combineReducers({ counter: counterReducer })

function createStore(pageContext: PageContext) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: pageContext.reduxState,
  })
}
