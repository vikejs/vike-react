export { createUseStore, createServerState }

import { useContext } from 'react'
import { PageContext } from 'vike/types'
import { useStore as useZustandStore } from 'zustand'
import { getContext, setCreateStore } from '../renderer/context.js'
import { ExtractState, PASS_TO_CLIENT, StoreApi } from './types.js'

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

function createServerState<T extends Record<string, any>>(fn: () => T) {
  if (typeof window === 'undefined') {
    const state = fn()
    const keys = Object.keys(state)

    //@ts-ignore
    state[PASS_TO_CLIENT] = keys

    return state
  }
  return {} as T
}
