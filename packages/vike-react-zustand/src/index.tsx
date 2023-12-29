export { create, serverOnly, withPageContext }

import { useContext } from 'react'
import { getContext, setCreateStore } from './renderer/context.js'
import { create as create_ } from 'zustand'
import type { StoreMutatorIdentifier, UseBoundStore, Mutate, StoreApi as ZustandStoreApi } from 'zustand'
import type { PageContext } from 'vike/types'

type Create = {
  <T, Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>
  ): UseBoundStore<Mutate<ZustandStoreApi<T>, Mos>>
  <T>(): <Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>
  ) => UseBoundStore<Mutate<ZustandStoreApi<T>, Mos>>
  /**
   * @deprecated Use `useStore` hook to bind store
   */
  <S extends ZustandStoreApi<unknown>>(store: S): UseBoundStore<S>
}

type Get<T, K, F> = K extends keyof T ? T[K] : F
export type StateCreator<
  T,
  Mis extends [StoreMutatorIdentifier, unknown][] = [],
  Mos extends [StoreMutatorIdentifier, unknown][] = [],
  U = T
> = ((
  setState: Get<Mutate<ZustandStoreApi<T>, Mis>, 'setState', never>,
  getState: Get<Mutate<ZustandStoreApi<T>, Mis>, 'getState', never>,
  store: Mutate<ZustandStoreApi<T>, Mis>
) => U) & {
  $$storeMutators?: Mos
}

const create: Create = ((storeCreatorFn: any) => {
  return storeCreatorFn ? createImpl(storeCreatorFn) : createImpl
}) as any

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
      // but we need to pass the original storeCreatorFn(_storeCreatorFn) to create_
      return create_()(storeCreatorFn(pageContext)._storeCreatorFn)
    } else {
      return create_()(storeCreatorFn)
    }
  })

  function useStore(...args: any[]) {
    const zustandContext = getContext()
    const store = useContext(zustandContext)
    if (!store) throw new Error('Store is missing the provider')
    // @ts-ignore
    return store(...args)
  }

  useStore._storeCreatorFn = storeCreatorFn
  return useStore
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
