export const redux = {
  createStore,
}

export type AppStore = ReturnType<typeof createStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import counterReducer from '../lib/features/counter/counterSlice'
const rootReducer = combineReducers({ counter: counterReducer })

function createStore(preloadedState: any) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}
