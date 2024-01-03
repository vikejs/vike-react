export { initializers_set }
export { initializers_get }
export { withPageContextInitializers_set }
export { withPageContextInitializers_get }
export { getReactStoreContext }

import { createContext } from 'react'
import type { PageContext } from 'vike/types'
import type { StoreApiAndHook } from '../types.js'
import { getGlobalObject } from '../utils.js'

const globalObject = getGlobalObject('context.ts', {
  reactStoreContext: createContext<{ [key: string]: StoreApiAndHook }>({}),
  withPageContextInitializers: {} as { [key: string]: (pageContext: PageContext) => any },
  initializers: {} as { [key: string]: any }
})

const getReactStoreContext: () => React.Context<{ [key: string]: StoreApiAndHook }> = () =>
  globalObject.reactStoreContext

function initializers_set(key: string, initializer: any) {
  // useMemo will notice the change because we create a new object
  globalObject.initializers = {
    ...globalObject.initializers,
    [key]: initializer
  }
}
function initializers_get() {
  return globalObject.initializers
}

function withPageContextInitializers_set(key: string, withPageContextCallback: any) {
  // useMemo will notice the change because we create a new object
  globalObject.withPageContextInitializers = {
    ...globalObject.withPageContextInitializers,
    [key]: withPageContextCallback
  }
}
function withPageContextInitializers_get() {
  return globalObject.withPageContextInitializers
}
