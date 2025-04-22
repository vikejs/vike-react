export { withPageContext } from './withPageContext.js'
export { createWrapped as create, useStoreApi }

import { usePageContext } from 'vike-react/usePageContext'
import { createStore } from './createStores.js'
import type { Create, StoreApiOnly, StoreHookOnly } from './types.js'
import { assert } from './utils/assert.js'
import { useStream, useStreamOptional } from 'react-streaming'

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
    function useStore(...args: any[]): any {
      //@ts-ignore
      const store = useStoreApi(useStore)
      //@ts-ignore
      return store(...args)
    }
    useStore.__key__ = key
    useStore.__initializerFn__ = initializerFn_
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
  const key = useStore.__key__
  //@ts-ignore
  const initializerFn = useStore.__initializerFn__
  assert(key)
  const pageContext = usePageContext()
  const stream = useStreamOptional()
  const store = createStore({ key, initializerFn, pageContext, stream })
  assert(store)
  return store as unknown as StoreApiOnly<T>
}
