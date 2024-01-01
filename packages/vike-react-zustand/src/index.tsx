export { createWrapper as create, serverOnly, withPageContext }

// TODO: make this export internal
export { callCreateOriginal }

import { useContext } from 'react'
import type { PageContext } from 'vike/types'
import { create as createOriginal } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getReactStoreContext, initializer_set, withPageContextCallback_set } from './renderer/context.js'

/**
 * Zustand integration for vike-react.
 *
 * The `devtools` middleware is included by default.
 *
 * Usage examples: https://docs.pmnd.rs/zustand/guides/typescript#basic-usage
 *
 */
const createWrapper: typeof createOriginal = ((initializer: any) => {
  // Support `create()(() => { /* ... * })`
  return initializer ? create(initializer) : create
}) as any

function callCreateOriginal(initializer: any) {
  return createOriginal()(devtools(initializer))
}

function create(initializer: any): any {
  initializer_set(initializer)
  return getStoreProxy()
}

function getStoreProxy(): any {
  function useStore() {
    const reactStoreContext = getReactStoreContext()
    const store = useContext(reactStoreContext)
    if (!store) throw new Error('Store is missing the provider')
    return store
  }
  return new Proxy(useStore, {
    get(target, p: keyof ReturnType<typeof createOriginal>) {
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
function withPageContext<Store extends ReturnType<typeof createOriginal>>(
  withPageContextCallback: (pageContext: PageContext) => Store
): Store {
  withPageContextCallback_set(withPageContextCallback)
  return getStoreProxy()
}
