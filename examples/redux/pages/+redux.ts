export { redux }

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import counterReducer from '../lib/features/counter/counterSlice'

const rootReducer = combineReducers({ counter: counterReducer })

const redux = {
  createStore: (preloadedState: any) => {
    return configureStore({
      reducer: rootReducer,
      preloadedState,
    })
  },
}

// Infer the type of createStore
export type AppStore = ReturnType<typeof redux.createStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch']
