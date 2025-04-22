export { createStore }

import type { PageContext } from 'vike/types'
import { create as createZustand } from 'zustand'
import { devtools } from 'zustand/middleware'
import { setPageContext } from './context.js'
import { mergeWith } from 'lodash-es'
import { getGlobalObject } from './utils/getGlobalObject.js'

// Client-side cache (not used in SSR)
const clientCache = import.meta.env.SSR
  ? null
  : getGlobalObject('createStore.ts', {
      initializers: {} as Record<string, any>,
      stores: {} as Record<string, any>,
    })

function createStore({
  key,
  initializerFn,
  pageContext,
}: {
  key: string
  initializerFn: any
  pageContext: PageContext
}) {
  pageContext._vikeReactZustandStores ??= {}
  let store = pageContext._vikeReactZustandStores[key]
  if (store) return store

  try {
    setPageContext(pageContext)
    const needsNewStore = import.meta.env.SSR || !clientCache || clientCache.initializers[key] !== initializerFn
    if (needsNewStore) {
      store = createStore_(initializerFn)
      if (!import.meta.env.SSR && clientCache) {
        clientCache.stores[key] = store
        clientCache.initializers[key] = initializerFn
        loadServerStateOptional({ key, store, pageContext })
      }
    } else {
      store = clientCache.stores[key]
    }
    pageContext._vikeReactZustandStores[key] = store
    return store
  } finally {
    setPageContext(null)
  }
}

function createStore_(initializer: any) {
  return createZustand()(devtools(initializer))
}

function loadServerStateOptional({ key, store, pageContext }: { key: string; store: any; pageContext: PageContext }) {
  const clientState = store.getInitialState() as any
  const hasServerState = pageContext._vikeReactZustandState && key in pageContext._vikeReactZustandState
  const needsHydration = !store.__hydrated__
  if (hasServerState && needsHydration) {
    const serverState = pageContext._vikeReactZustandState[key]
    mergeWith(clientState, serverState)
    store.__hydrated__ = true
  }
}
