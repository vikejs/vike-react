export { createWrapped as create, serverOnly, withPageContext, useStoreApi }

import { useContext } from 'react'
import type { PageContext } from 'vike/types'
import { getReactStoreContext, initializer_set, withPageContextCallback_set } from './renderer/context.js'
import { type create as createZustand } from 'zustand'
import { assert } from './utils.js'

/**
 * Zustand integration for vike-react.
 *
 * The `devtools` middleware is included by default.
 *
 * Usage examples: https://docs.pmnd.rs/zustand/guides/typescript#basic-usage
 *
 */
const createWrapped: typeof createZustand = ((initializer: any) => {
  // Support `create()(() => { /* ... * })`
  return initializer ? create(initializer) : create
}) as any
function create(initializer: any): any {
  initializer_set(initializer)
  return getUseStore()
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
function withPageContext<Store extends ReturnType<typeof createZustand>>(
  withPageContextCallback: (pageContext: PageContext) => Store
): Store {
  withPageContextCallback_set(withPageContextCallback)
  return getUseStore()
}

function useStoreApi() {
  const reactStoreContext = getReactStoreContext()
  const store = useContext(reactStoreContext)
  assert(store)
  return store
}

function getUseStore(): any {
  function useStore(...args: any[]) {
    const store = useStoreApi()
    //@ts-ignore
    return store(...args)
  }

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
