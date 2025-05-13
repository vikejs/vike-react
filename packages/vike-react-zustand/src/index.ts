export { withPageContext } from './withPageContext.js'
export { createWrapped as create, useStoreApi }

import { useStreamOptional } from 'react-streaming'
import { usePageContext } from 'vike-react/usePageContext'
import type { StateCreator } from 'zustand'
import { getOrCreateStore } from './getOrCreateStore.js'
import type { Create, StoreApiAndHook, StoreApiOnly, StoreHookOnly } from './types.js'
import { assert } from './utils/assert.js'

// Define Symbol keys for internal use
const STORE_KEY = Symbol.for('vike-react-zustand-store-key')
const STORE_INITIALIZER_FN = Symbol.for('vike-react-zustand-store-initializer-fn')

// Internal interface that extends StoreHookOnly with our symbol properties
// This keeps the symbols out of the public API while allowing TypeScript to type-check correctly
interface InternalStoreHookOnly<T> extends StoreHookOnly<T> {
  [STORE_KEY]: string
  [STORE_INITIALIZER_FN]: StateCreator<T, [], []>
}

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
    // create('key', (set,get) => ...)
    //               ^^^^^^^^^^^^^^^
    (typeof args[1] === 'function' && args[1]) ||
    // The transform didn't run for this call(skipped in node_modules)
    // create((set,get) => ...)
    //        ^^^^^^^^^^^^^^^
    (typeof args[0] === 'function' && args[0]) ||
    // create('key')((set,get) => ...)
    //         ^^^
    // create()((set,get) => ...)
    //       ^
    undefined

  const key =
    // create('key')((set,get) => ...)
    //         ^^^
    // create('key', (set,get) => ...)
    //         ^^^
    (typeof args[0] === 'string' && args[0]) ||
    // The transform didn't run for this call(skipped in node_modules)
    // create()((set,get) => ...)
    // create((set,get) => ...)
    'default'

  assert(key)

  const create_ = <T>(initializerFn_: StateCreator<T, [], []>): StoreHookOnly<T> => {
    assert(initializerFn_)
    const useStore = ((...args: Parameters<StoreHookOnly<T>>) => {
      const store = useStoreApi(useStore) as StoreApiAndHook<T>
      return store(...args)
    }) as InternalStoreHookOnly<T>

    useStore[STORE_KEY] = key
    useStore[STORE_INITIALIZER_FN] = initializerFn_
    return useStore
  }

  if (initializerFn) {
    // create((set,get) => ...)
    return create_(initializerFn)
  }

  // create()((set,get) => ...)
  return create_
}) as Create

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
function useStoreApi<T>(useStore: StoreHookOnly<T>): StoreApiOnly<T> {
  const internalStoreHook = useStore as InternalStoreHookOnly<T>
  const key = internalStoreHook[STORE_KEY]
  const initializerFn = internalStoreHook[STORE_INITIALIZER_FN]
  assert(key)
  assert(initializerFn)
  const pageContext = usePageContext()
  const stream = useStreamOptional()
  const store = getOrCreateStore({ key, initializerFn, pageContext, stream })
  assert(store)
  return store as StoreApiOnly<T>
}
