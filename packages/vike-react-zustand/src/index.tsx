export { createUseStore, server }

import { useContext } from 'react'
import { PageContext } from 'vike/types'
import { useStore as useZustandStore } from 'zustand'
import { getContext, setCreateStore } from '../renderer/context.js'
import { ExtractState, StoreApi } from './types.js'

function createUseStore<S extends StoreApi>(createStore: (pageContext: PageContext) => S) {
  setCreateStore(createStore)

  function useStore(): ExtractState<S>
  function useStore<TSelection>(selector: (state: ExtractState<S>) => TSelection): TSelection
  function useStore<TSelection>(selector?: (state: ExtractState<S>) => TSelection) {
    const zustandContext = getContext<S>()
    const store = useContext(zustandContext)
    if (!store) throw new Error('Store is missing the provider')
    return useZustandStore(store, selector ?? store.getState)
  }

  return useStore
}

function server<T extends Record<string, any>>(fn: () => T) {
  if (typeof window === 'undefined') {
    return fn()
  }
  return {} as T
}
