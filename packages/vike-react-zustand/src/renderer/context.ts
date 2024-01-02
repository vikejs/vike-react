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
  reactStoreContext: createContext<{ [key: string]: StoreAndHook }>({}),
  withPageContextCallback: {} as { [key: string]: (pageContext: PageContext) => StoreAndHook },
  initializers: {} as { [key: string]: any }
})

const getReactStoreContext = () => globalObject.reactStoreContext

function initializer_set(key: string, initializer: any) {
  // useMemo will notice the change because we create a new object
  globalObject.initializers = {
    ...globalObject.initializers,
    [key]: initializer
  }
}
function initializer_get() {
  return globalObject.initializers
}

function withPageContextCallback_set(key: string, withPageContextCallback: any) {
  // useMemo will notice the change because we create a new object
  globalObject.withPageContextCallback = {
    ...globalObject.withPageContextCallback,
    [key]: withPageContextCallback
  }
}
function withPageContextCallback_get() {
  return globalObject.withPageContextCallback
}
