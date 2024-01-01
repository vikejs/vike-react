export { create, serverOnly, withPageContext }

import { useContext } from 'react'
import type { PageContext } from 'vike/types'
import { create as create_ } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getContext, setCreateStore } from './renderer/context.js'
import { assert } from './utils.js'

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
      const originalStoreCreatorFn = storeCreatorFn(pageContext)[STORE_CREATOR_FN]
      assert(originalStoreCreatorFn)
      return create_()(devtools(originalStoreCreatorFn))
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
  // @ts-ignore
  import.meta.env ??= { SSR: true }
  if (import.meta.env.SSR) {
    return getStateOnServerSide()
  }
  return {} as T
}

/**
 * Utility to make `pageContext` available to the store.
 *
 * Example usage:
 *
 * ```ts
 *
 * interface Store {
 *   user: {
 *     id: number
 *     firstName: string
 *   }
 * }
 *
 * const useStore = withPageContext((pageContext) =>
 *   create<Store>()((set, get) => ({
 *     user: pageContext.user
 *   }))
 * )
 * ```
 */
function withPageContext<Store extends ReturnType<typeof create_>>(
  withPageContextCallback: (pageContext: PageContext) => Store
): Store {
  const wrappedStoreCreatorFn = (pageContext: any) => withPageContextCallback(pageContext)
  wrappedStoreCreatorFn._withPageContext = true
  return createImpl(wrappedStoreCreatorFn)
}
