export { getOrCreateStore }
export type { CreateStoreReturn }

import { parse } from '@brillout/json-serializer/parse'
import { stringify } from '@brillout/json-serializer/stringify'
import type { PageContext } from 'vike/types'
import { create as createZustand, StateCreator } from 'zustand'
import { setPageContext } from './context.js'
import { assert } from './utils/assert.js'
import { getGlobalObject } from './utils/getGlobalObject.js'
import { sanitizeForSerialization } from './utils/sanitizeForSerialization.js'
import { assignDeep } from './utils/assignDeep.js'

// Client-side cache (not used in SSR)
const clientCache = !globalThis.__VIKE__IS_CLIENT
  ? null
  : getGlobalObject('getOrCreateStore.ts', {
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
    if (!globalThis.__VIKE__IS_CLIENT) {
      pageContext._vikeReactZustandStoresServer ??= {}
      let store = pageContext._vikeReactZustandStoresServer[key] as CreateStoreReturn<T>
      if (store) return store
      store = createStore_(initializerFn)
      const serverState = store.getInitialState()
      const transferableState = sanitizeForSerialization(serverState)
      assert(stream)
      // No need to escape the injected HTML — see https://github.com/vikejs/vike/blob/36201ddad5f5b527b244b24d548014ec86c204e4/packages/vike/src/server/runtime/renderPageServer/csp.ts#L45
      const nonceAttr = (pageContext as any).cspNonce ? ` nonce="${(pageContext as any).cspNonce}"` : ''
      stream.injectToStream(
        `<script${nonceAttr}>if(!globalThis._vikeReactZustandState)globalThis._vikeReactZustandState={};globalThis._vikeReactZustandState['${key}']='${stringify(transferableState)}'</script>`,
      )
      pageContext._vikeReactZustandStoresServer[key] = store
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
  } finally {
    setPageContext(null)
  }
}

type CreateStoreReturn<T> = ReturnType<typeof createStore_<T>>
function createStore_<T>(initializer: StateCreator<T, [], []>) {
  return createZustand<T>()(initializer)
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
