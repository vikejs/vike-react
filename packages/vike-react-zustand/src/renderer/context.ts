export { getContext, getCreateStore, setCreateStore }

import { createContext } from 'react'
import type { PageContext } from 'vike/types'
import type { create } from 'zustand'
import { getGlobalObject } from '../utils.js'

type StoreAndHook = ReturnType<typeof create>
type CreateStore = (pageContext: PageContext) => StoreAndHook

const globalObject = getGlobalObject('context.ts', {
  createStore: undefined as CreateStore | undefined,
  context: createContext<StoreAndHook | undefined>(undefined)
})

const getContext = () => globalObject.context

const getCreateStore = () => globalObject.createStore
const setCreateStore = (createStore_: CreateStore) => {
  globalObject.createStore = createStore_
}
