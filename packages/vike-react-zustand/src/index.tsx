export { createWrapped as create, serverOnly, useStoreApi }
export { withPageContext } from './withPageContext.js'

import { useContext } from 'react'
import { getReactStoreContext, initializers_set } from './renderer/context.js'
import type { Create, StoreApiOnly, StoreHookOnly } from './types.js'
import { assert } from './utils.js'

/**
 * Zustand integration for vike-react.
 *
 * The `devtools` middleware is included by default.
 *
 * Usage examples: https://docs.pmnd.rs/zustand/guides/typescript#basic-usage
 *
 */
const createWrapped = ((key: string, initializer: any) => {
  // Support `create()(() => { /* ... * })`
  return initializer ? create(key, initializer) : create
}) as unknown as Create

const create = (key: string, initializer: any) => {
  initializers_set(key, initializer)
  return getUseStore(key)
}

/**
 * Sometimes you need to access state in a non-reactive way or act upon the store. For these cases, useStoreApi can be used.
 *
 * ⚠️ Note that middlewares that modify set or get are not applied to getState and setState.
 *
 * Example usage:
 *
 * ```ts
 *
 * import { useStoreApi } from 'vike-react-zustand'
 * import { useStore } from './store'
 *
 * function Component() {
 *   const api = useStoreApi(useStore)
 *   function onClick() {
 *     api.setState({ ... })
 *   }
 * }
 *```
 */
// require users to pass useStore, because:
// 1. useStore needs to be imported at least once for the store to exist
// 2. the store key is stored on the useStore object
function useStoreApi<T>(useStore: StoreHookOnly<T>): StoreApiOnly<T> {
  //@ts-ignore
  const key = typeof useStore === 'string' ? useStore : useStore.__key__
  assert(key)
  const reactStoreContext = getReactStoreContext()
  const stores = useContext(reactStoreContext)
  const store = stores[key]
  assert(store)
  return store as unknown as StoreApiOnly<T>
}

function getUseStore(key: string): any {
  function useStore(...args: any[]) {
    //@ts-ignore
    const store = useStoreApi(key)
    //@ts-ignore
    return store(...args)
  }
  useStore.__key__ = key
  return useStore
}

/**
 * The function passed to `serverOnly()` only runs on the server-side, while the state returned by it is available on both the server- and client-side.
 *
 * Example usage:
 *
 * ```ts
 *
 * import { create, serverOnly } from 'vike-react-zustand'
 *
 * // We use serverOnly() because process.version is only available on the server-side but we want to be able to access it everywhere (client- and server-side).
 * const useStore = create<{ nodeVersion: string }>()({
 *   ...serverOnly(() => ({
 *     // This function is called only on the server-side, but nodeVersion is available on both the server- and client-side.
 *     nodeVersion: process.version
 *   }))
 * })
 * ```
 */
function serverOnly<T extends Record<string, any>>(getStateOnServerSide: () => T) {
  // Trick to make import.meta.env.SSR work direclty on Node.js (without Vite)
  // @ts-expect-error
  import.meta.env ??= { SSR: true }
  if (import.meta.env.SSR) {
    return getStateOnServerSide()
  }
  return {} as T
}
