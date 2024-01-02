export { initializer_set }
export { initializers_get }
export { withPageContextCallback_set }
export { withPageContextCallbacks_get }
export { storeHooksWithPageContextMapping_set }
export { storeHooksWithPageContextMapping_get }
export { getReactStoreContext }

import { createContext } from 'react'
import type { PageContext } from 'vike/types'
import type { StoreApiAndHook, StoreHookOnly } from '../types.js'
import { getGlobalObject } from '../utils.js'

const globalObject = getGlobalObject('context.ts', {
  reactStoreContext: createContext<{ [key: string]: StoreApiAndHook }>({}),
  withPageContextCallbacks: {} as { [key: string]: (pageContext: PageContext) => StoreHookOnly<any> },
  initializers: {} as { [key: string]: any },
  storeHooksWithPageContextMapping: {} as { [key: string]: StoreHookOnly<any> }
})

const getReactStoreContext: () => React.Context<{ [key: string]: StoreApiAndHook }> = () =>
  globalObject.reactStoreContext

function initializer_set(key: string, initializer: any) {
  // useMemo will notice the change because we create a new object
  globalObject.initializers = {
    ...globalObject.initializers,
    [key]: initializer
  }
}
function initializers_get() {
  return globalObject.initializers
}

function withPageContextCallback_set(key: string, withPageContextCallback: any) {
  // useMemo will notice the change because we create a new object
  globalObject.withPageContextCallbacks = {
    ...globalObject.withPageContextCallbacks,
    [key]: withPageContextCallback
  }
}
function withPageContextCallbacks_get() {
  return globalObject.withPageContextCallbacks
}

function storeHooksWithPageContextMapping_set(key: string, storeHookOnly: StoreHookOnly<any>) {
  globalObject.storeHooksWithPageContextMapping = {
    ...globalObject.storeHooksWithPageContextMapping,
    [key]: storeHookOnly
  }
}

function storeHooksWithPageContextMapping_get(key: string) {
  return globalObject.storeHooksWithPageContextMapping[key]
}
