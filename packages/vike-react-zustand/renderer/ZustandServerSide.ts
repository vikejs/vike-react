import { createContext } from 'react'
import { getGlobalObject } from './utils/getGlobalObject.js'

const globalObject = getGlobalObject('ZustandServerSide.ts', {
  createStore: undefined as any,
  // createStoreOptions: undefined as any,
  zustandContext: createContext<any | null>(null)
})

export const getCreateStore = () => globalObject.createStore
// export const getCreateStoreOptions = () => globalObject.createStoreOptions
export const getContext = () => globalObject.zustandContext

export const setCreateStore = (createStore_: any) => {
  globalObject.createStore = createStore_
  // globalObject.createStoreOptions = createStoreOptions_
}
