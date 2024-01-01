export { initializer_set }
export { initializer_get }
export { withPageContextCallback_set }
export { withPageContextCallback_get }
export { getReactStoreContext }

import { createContext } from 'react'
import type { PageContext } from 'vike/types'
import type { create } from 'zustand'
import { getGlobalObject } from '../utils.js'

type StoreAndHook = ReturnType<typeof create>

const globalObject = getGlobalObject('context.ts', {
  reactStoreContext: createContext<StoreAndHook | undefined>(undefined),
  withPageContextCallback: undefined as undefined | ((pageContext: PageContext) => StoreAndHook),
  initializer: undefined as any
})

const getReactStoreContext = () => globalObject.reactStoreContext

function initializer_set(initializer: any) {
  globalObject.initializer = initializer
}
function initializer_get() {
  return globalObject.initializer
}

function withPageContextCallback_set(withPageContextCallback: any) {
  globalObject.withPageContextCallback = withPageContextCallback
}
function withPageContextCallback_get() {
  return globalObject.withPageContextCallback
}
