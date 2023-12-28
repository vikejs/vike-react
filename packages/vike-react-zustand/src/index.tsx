export { create, server }

import { useContext } from 'react'
import { getContext, setCreateStore } from './renderer/context.js'
import { create as create_ } from 'zustand'

function create(createStore: any): any {
  setCreateStore(() => {
    return create_(createStore)
  })

  function useStore(...args: any[]) {
    const zustandContext = getContext()
    const store = useContext(zustandContext)
    if (!store) throw new Error('Store is missing the provider')
    // @ts-ignore
    return store(...args)
  }

  return useStore
}

function server<T extends Record<string, any>>(fn: () => T) {
  if (typeof window === 'undefined') {
    return fn()
  }
  return {} as T
}
