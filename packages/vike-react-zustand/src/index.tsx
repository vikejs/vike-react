export { create, server }

import { useContext } from 'react'
import { getContext, setCreateStore } from './renderer/context.js'
import { create as create_ } from 'zustand'
import type { StoreMutatorIdentifier, UseBoundStore, Mutate, StoreApi as ZustandStoreApi } from 'zustand'

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

const create: Create = ((createState: any) => {
  return createState ? createImpl(createState) : createImpl
}) as any

function createImpl(createStore: any): any {
  // @ts-ignore
  setCreateStore((pageContext: any) => {
    return create_(createStore)
  })

  function useStore(...args: any[]) {
    const zustandContext = getContext()
    const store = useContext(zustandContext)
    if (!store) throw new Error('Store is missing the provider')
    // @ts-ignore
    return store(...args)
  }

  return useStore
}

function server<T extends Record<string, any>>(fn: () => T) {
  if (typeof window === 'undefined') {
    return fn()
  }
  return {} as T
}
type StoreAndHook = ReturnType<typeof create>
function withPageContext<S extends StoreAndHook>(storeCreatorCreatorFn: (pageContext: StoreAndHook) => S) {
  //@ts-ignore
  // createImpl._withPageContext_ = storeCreatorFn
  // const storeCreatorFn = () => {
  //   storeCreatorCreatorFn(pageContext)
  //   return createImpl(storeCreatorFn)
  // }
}
