export { getContext, getCreateStore, setCreateStore }

import React, { createContext } from 'react'
import { getGlobalObject } from '../utils.js'
import type { create } from 'zustand'

type StoreAndHook = ReturnType<typeof create>
type CreateStore = (pageContext: any) => StoreAndHook & { __hydrated__?: true }

const globalObject = getGlobalObject('VikeReactZustandContext.ts', {
  createStore: undefined as CreateStore | undefined,
  context: createContext<StoreAndHook | undefined>(undefined)
})

const getContext = () => globalObject.context as unknown as React.Context<StoreAndHook | undefined>

const getCreateStore = () => globalObject.createStore
const setCreateStore = (createStore_: CreateStore) => {
  globalObject.createStore = createStore_
}
