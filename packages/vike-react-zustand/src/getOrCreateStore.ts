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
      assert(!pageContext.isClientSide)
      pageContext._vikeReactZustandStoresServer ??= {}
      let store = pageContext._vikeReactZustandStoresServer[key] as CreateStoreReturn<T>
      if (store) return store
      store = createStore_(initializerFn)
      const serverState = store.getInitialState()
      const transferableState = sanitizeForSerialization(serverState)
      assert(stream)
      // No need to escape the injected nonce attribute — see https://github.com/vikejs/vike/blob/36201ddad5f5b527b244b24d548014ec86c204e4/packages/vike/src/server/runtime/renderPageServer/csp.ts#L45
      const nonceAttr = pageContext.cspNonce ? ` nonce="${pageContext.cspNonce}"` : ''
      // The state is embedded as the textContent of an inert <script type="application/json"> (never parsed as JavaScript) instead of inside an executable JavaScript string literal, so no JavaScript-string escaping is needed: the only sensitive character is `<` (so that the HTML parser never encounters `</script>` nor `<!--` inside the block) and `htmlScriptSafe` escapes it. The adjacent registrar <script> runs synchronously at parse time and reads its own data block via `previousElementSibling` (both tags are injected together, so they're always adjacent). See https://github.com/vikejs/vike/issues/3463
      // `key` is developer-controlled (a build-time hash or an explicit `create('key')` argument), never website-visitor data, so interpolating it into the registrar carries no XSS risk.
      const serialized = stringify(transferableState, { htmlScriptSafe: true })
      stream.injectToStream(
        `<script type="application/json">${serialized}</script>` +
          `<script${nonceAttr}>if(!globalThis._vikeReactZustandState)globalThis._vikeReactZustandState={};globalThis._vikeReactZustandState['${key}']=document.currentScript.previousElementSibling.textContent</script>`,
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
