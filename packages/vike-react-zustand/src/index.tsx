export { create, serverOnly, withPageContext }

import { useContext } from 'react'
import type { PageContext } from 'vike/types'
import { create as create_ } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getContext, setCreateStore } from './renderer/context.js'

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

function serverOnly<T extends Record<string, any>>(fn: () => T) {
  if (typeof window === 'undefined') {
    return fn()
  }
  return {} as T
}

function withPageContext<S extends ReturnType<typeof create_>>(storeCreatorFn: (pageContext: PageContext) => S): S {
  const wrappedStoreCreatorFn = (pageContext: any) => storeCreatorFn(pageContext)
  wrappedStoreCreatorFn._withPageContext = true
  return createImpl(wrappedStoreCreatorFn)
}
