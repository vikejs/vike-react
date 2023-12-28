import React, { createContext } from 'react'
import { CreateStore, StoreApi } from '../src/types.js'
import { getGlobalObject } from './utils.js'

const globalObject = getGlobalObject('VikeReactZustandContext.ts', {
  createStore: undefined as CreateStore | undefined,
  context: createContext<StoreApi | undefined>(undefined)
})

export const getCreateStore = () => globalObject.createStore
export const getContext = <S extends StoreApi>() => globalObject.context as unknown as React.Context<S | undefined>

export const setCreateStore = (createStore_: CreateStore) => {
  globalObject.createStore = createStore_
}
