export { create, serverOnly, withPageContext }

import { useContext } from 'react'
import type { PageContext } from 'vike/types'
import { create as create_ } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getContext, setCreateStore } from './renderer/context.js'

/**
 * Zustand integration for vike-react.
 *
 * The `devtools` middleware is included by default.
 *
 * Usage examples: https://docs.pmnd.rs/zustand/guides/typescript#basic-usage
 *
 */
const create: typeof create_ = ((storeCreatorFn: any) => {
  return storeCreatorFn ? createImpl(storeCreatorFn) : createImpl
}) as any

const STORE_CREATOR_FN = Symbol('STORE_CREATOR_FN')
function createImpl(storeCreatorFn: any): any {
  setCreateStore((pageContext: any) => {
    // This is called only once per request
    if (storeCreatorFn._withPageContext) {
      // storeCreatorFn(pageContext) looks like this:
      // (pageContext) =>
      //   create((set, get) => ({
      //     counter: 123
      //   }))
      // create calls createImpl a second time, and it returns useStore.
      // but we need to pass the original storeCreatorFn(STORE_CREATOR_FN) to create_
      return create_()(devtools(storeCreatorFn(pageContext)[STORE_CREATOR_FN]))
    } else {
      return create_()(devtools(storeCreatorFn))
    }
  })

  function useStore() {
    const zustandContext = getContext()
    const store = useContext(zustandContext)
    if (!store) throw new Error('Store is missing the provider')
    return store
  }

  return new Proxy(useStore, {
    get(target, p: keyof ReturnType<typeof create_> | typeof STORE_CREATOR_FN) {
      if (p === STORE_CREATOR_FN) {
        return storeCreatorFn
      }
      return target()[p]
    },
    apply(target, _this, [selector]) {
      return target()(selector)
    }
  })
}

/**
 * The function passed to `serverOnly` only runs on the `server`.
 *
 * The return value is available in the store on `client`/`server`.
 * @param getState
 */
function serverOnly<T extends Record<string, any>>(getState: () => T) {
  if (typeof window === 'undefined') {
    return getState()
  }
  return {} as T
}

/**
 * To make `pageContext` available to the store and middlewares, you can wrap the store using `withPageContext`.
 *
 * Example usage:
 *
 * ```ts
 * interface Store {
 *   url: string
 * }
 *
 * const useStore = withPageContext((pageContext) =>
 *   create<Store>()((set, get) => ({
 *     url: pageContext.urlOriginal
 *   }))
 * )
 * ```
 *
 */
function withPageContext<S extends ReturnType<typeof create_>>(storeCreatorFn: (pageContext: PageContext) => S): S {
  const wrappedStoreCreatorFn = (pageContext: any) => storeCreatorFn(pageContext)
  wrappedStoreCreatorFn._withPageContext = true
  return createImpl(wrappedStoreCreatorFn)
}
