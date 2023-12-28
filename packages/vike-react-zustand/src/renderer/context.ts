import React, { createContext } from 'react'
import { getGlobalObject } from '../utils.js'
import type { create } from 'zustand'

type StoreAndHook = ReturnType<typeof create>
type CreateStore = () => StoreAndHook & { __hydrated__?: true }

const globalObject = getGlobalObject('VikeReactZustandContext.ts', {
  createStore: undefined as CreateStore | undefined,
  context: createContext<StoreAndHook | undefined>(undefined)
})

export const getCreateStore = () => globalObject.createStore
export const getContext = () => globalObject.context as unknown as React.Context<StoreAndHook | undefined>

export const setCreateStore = (createStore_: CreateStore) => {
  globalObject.createStore = createStore_
}
