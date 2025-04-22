export { createStore }

import { parse, stringify } from 'devalue'
import { mergeWith } from 'lodash-es'
import type { PageContext } from 'vike/types'
import { create as createZustand } from 'zustand'
import { devtools } from 'zustand/middleware'
import { setPageContext } from './context.js'
import { assert } from './utils/assert.js'
import { getGlobalObject } from './utils/getGlobalObject.js'
import { removeFunctionsAndUndefined } from './utils/removeFunctionsAndUndefined.js'

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
  stream,
}: {
  key: string
  initializerFn: any
  pageContext: PageContext
  stream: ReturnType<typeof import('react-streaming').useStreamOptional>
}) {
  try {
    setPageContext(pageContext)
    if (import.meta.env.SSR) {
      pageContext._vikeReactZustandStores ??= {}
      let store = pageContext._vikeReactZustandStores[key]
      if (store) return store
      store = createStore_(initializerFn)
      const serverState = store.getInitialState()
      const transferableState = removeFunctionsAndUndefined(serverState)
      assert(stream)
      stream.injectToStream(
        `<script>if(!window._vikeReactZustandState)window._vikeReactZustandState={};window._vikeReactZustandState['${key}']='${stringify(transferableState)}'</script>`,
      )
      pageContext._vikeReactZustandStores[key] = store
      return store
    } else {
      assert(clientCache)
      const storeNeedsRecreate = clientCache.initializers[key] !== initializerFn
      if (storeNeedsRecreate) {
        const store = createStore_(initializerFn)
        clientCache.stores[key] = store
        clientCache.initializers[key] = initializerFn
        mergeServerStateOptional({ key, store })
        return store
      } else {
        return clientCache.stores[key]
      }
    }

    assert(false)
  } finally {
    setPageContext(null)
  }
}

function createStore_(initializer: any) {
  return createZustand()(devtools(initializer))
}

declare global {
  var _vikeReactZustandState: undefined | Record<string, string>
}

function mergeServerStateOptional({ key, store }: { key: string; store: ReturnType<typeof createStore_> }) {
  if (globalThis._vikeReactZustandState && globalThis._vikeReactZustandState[key]) {
    const clientState = store.getInitialState()
    const serverState = parse(globalThis._vikeReactZustandState[key])
    mergeWith(clientState, serverState)
  }
}
