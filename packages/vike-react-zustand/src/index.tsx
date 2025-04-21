export { createWrapped as create, transfer, initialize, useStoreApi }
export { withPageContext } from './withPageContext.js'

import { useContext } from 'react'
import { getReactStoreContext, initializers_set } from './integration/context.js'
import type { Create, StoreApiOnly, StoreHookOnly } from './types.js'
import { assert, INITIALIZE_KEY, TRANSFER_KEY } from './utils.js'

/**
 * Zustand integration for vike-react.
 *
 * The `devtools` middleware is included by default.
 *
 * Usage examples: https://docs.pmnd.rs/zustand/guides/typescript#basic-usage
 *
 */
const createWrapped = ((...args: any[]) => {
  const initializerFn =
    // create('keyFromTransform', (set,get) => ...)
    //                            ^^^^^^^^^^^^^^^
    (typeof args[1] === 'function' && args[1]) ||
    // The transform didn't run for this call(skipped in node_modules)
    // create((set,get) => ...)
    //        ^^^^^^^^^^^^^^^
    (typeof args[0] === 'function' && args[0]) ||
    // create('keyFromTransform', 'keyFromUser')((set,get) => ...)
    //        ^^^^^^^^^^^^^
    // create('keyFromUser')((set,get) => ...)
    //        ^^^^^^^^^^^^^
    // create()((set,get) => ...)
    //       ^
    undefined

  const key =
    // create('keyFromTransform', 'keyFromUser')((set,get) => ...)
    //                            ^^^^^^^^^^^^^
    (typeof args[1] === 'string' && args[1]) ||
    // create('keyFromTransform')((set,get) => ...)
    //         ^^^^^^^^^^^^^
    // create('keyFromUser')((set,get) => ...)
    //        ^^^^^^^^^^^^^
    (typeof args[0] === 'string' && args[0]) ||
    // The transform didn't run for this call(skipped in node_modules)
    // create()((set,get) => ...)
    // create((set,get) => ...)
    'default'

  assert(key)

  const create_ = (initializerFn_: any) => {
    assert(initializerFn_)
    initializers_set(key, initializerFn_)
    const useStore = getUseStore(key)
    useStore.__key__ = key
    return useStore
  }

  if (initializerFn) {
    // create((set,get) => ...)
    return create_(initializerFn)
  }

  // create()((set,get) => ...)
  return create_
}) as unknown as Create

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
  return function useStore(...args: any[]) {
    //@ts-ignore
    const store = useStoreApi(key)
    //@ts-ignore
    return store(...args)
  }
}

/**
 * The function passed to `transfer()` only runs on the server-side, while the state returned by it is available on both the server- and client-side.
 *
 * Example usage:
 *
 * ```ts
 *
 * import { create, transfer } from 'vike-react-zustand'
 *
 * // We use transfer() because process.version is only available on the server-side but we want to be able to access it everywhere (client- and server-side).
 * const useStore = create<{ nodeVersion: string }>()({
 *   ...transfer(() => ({
 *     // This function is called only on the server-side, but nodeVersion is available on both the server- and client-side.
 *     nodeVersion: process.version
 *   }))
 * })
 * ```
 */
function transfer<T extends Record<string, any>>(getStateOnServerSide: () => T | Promise<T>): T {
  // Trick to make import.meta.env.SSR work direclty on Node.js (without Vite)
  // The assignment needs to be conditional, because in DEV, the condition is not statically analyzed/stripped
  // @ts-expect-error
  import.meta.env ??= { SSR: true }
  if (import.meta.env.SSR) {
    // Promise<T> is resolved in onBeforeRender()
    // @ts-expect-error
    return {
      [TRANSFER_KEY]: getStateOnServerSide,
    }
  }
  return {} as T
}

function initialize<T extends Record<string, any>>(initializerFn: () => T | Promise<T> | void | Promise<void>): T {
  // Promise<T> is resolved in onBeforeRender()
  // @ts-expect-error
  return {
    [INITIALIZE_KEY]: initializerFn,
  }
}
