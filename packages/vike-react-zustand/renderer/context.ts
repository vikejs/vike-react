import React, { createContext } from 'react'
import { CreateStore, StoreApi } from '../src/types.js'
import { getGlobalObject } from './utils/getGlobalObject.js'

const globalObject = getGlobalObject('ZustandServerSide.ts', {
  createStore: undefined as CreateStore | undefined,
  context: createContext<StoreApi | null>(null)
})

export const getCreateStore = () => globalObject.createStore
export const getContext = <S extends StoreApi>() => globalObject.context as unknown as React.Context<S | null>

export const setCreateStore = (createStore_: CreateStore) => {
  globalObject.createStore = createStore_
}
