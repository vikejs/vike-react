export { getOrCreateStore }

import { parse } from '@brillout/json-serializer/parse'
import { stringify } from '@brillout/json-serializer/stringify'
import type { PageContext } from 'vike/types'
import { create as createZustand, StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import { setPageContext } from './context.js'
import { assert } from './utils/assert.js'
import { getGlobalObject } from './utils/getGlobalObject.js'
import { sanitizeForSerialization } from './utils/sanitizeForSerialization.js'
import { assignDeep } from './utils/assignDeep.js'

// Client-side cache (not used in SSR)
const clientCache = import.meta.env.SSR
  ? null
  : getGlobalObject('createStore.ts', {
      initializers: {} as Record<string, StateCreator<any, [], []>>,
      stores: {} as Record<string, CreateStoreReturn<any>>,
    })

function getOrCreateStore<T>({
  key,
  initializerFn,
  pageContext,
  stream,
}: {
  key: string
  initializerFn: StateCreator<T, [], []>
  pageContext: PageContext
  stream: ReturnType<typeof import('react-streaming').useStreamOptional>
}): CreateStoreReturn<T> {
  try {
    setPageContext(pageContext)
    if (import.meta.env.SSR) {
      pageContext._vikeReactZustandStores ??= {}
      let store: ReturnType<typeof createStore_<T>> = pageContext._vikeReactZustandStores[key]
      if (store) return store
      store = createStore_(initializerFn)
      const serverState = store.getInitialState()
      const transferableState = sanitizeForSerialization(serverState)
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
        assignServerStateOptional({ key, store })
        return store
      } else {
        const store = clientCache.stores[key]
        assert(store)
        return store
      }
    }

    assert(false)
  } finally {
    setPageContext(null)
  }
}

type CreateStoreReturn<T> = ReturnType<typeof createStore_<T>>
function createStore_<T>(initializer: StateCreator<T, [], []>) {
  return createZustand<T>()(devtools(initializer))
}

declare global {
  var _vikeReactZustandState: undefined | Record<string, string>
}
function assignServerStateOptional<T>({ key, store }: { key: string; store: CreateStoreReturn<T> }) {
  if (globalThis._vikeReactZustandState && globalThis._vikeReactZustandState[key]) {
    const clientState = store.getInitialState()
    const serverState = parse(globalThis._vikeReactZustandState[key])
    assert(clientState && typeof clientState === 'object')
    assert(serverState && typeof serverState === 'object')
    assignDeep(clientState, serverState)
  }
}
