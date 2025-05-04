export { createStore }
export type AppStore = ReturnType<typeof createStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { counterReducer } from './slices/counter'
import type { PageContext } from 'vike/types'
import { todosReducer } from './slices/todos'
const reducer = combineReducers({ counter: counterReducer, todos: todosReducer })

function createStore(pageContext: PageContext) {
  const preloadedState = pageContext.isClientSide ? pageContext.redux!.ssrState : undefined
  return configureStore({ reducer, preloadedState })
}
