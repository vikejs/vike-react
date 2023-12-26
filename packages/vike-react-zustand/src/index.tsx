import { useContext } from 'react'
import { PageContext } from 'vike/types'
import { StoreApi, useStore as useZustandStore } from 'zustand'
import { getContext, setCreateStore } from '../renderer/ZustandServerSide.js'

export const createUseStore = <TStore, TStoreApi extends StoreApi<any> = StoreApi<any>>(
  createStore: (pageContext: PageContext) => TStoreApi
) => {
  setCreateStore(createStore)

  const useStore = <TSelection = TStore,>(selector?: (state: TStore) => TSelection) => {
    const zustandContext = getContext()
    selector ??= (state) => state as unknown as TSelection
    const store = useContext<TStoreApi>(zustandContext)
    if (!store) throw new Error('Store is missing the provider')
    return useZustandStore(store, selector)
  }

  return useStore
}
