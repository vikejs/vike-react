export { initializers_set }
export { initializers_get }
export { setPageContext }
export { getPageContext }
export { getReactStoreContext }

import { createContext } from 'react'
import type { PageContext } from 'vike/types'
import type { StoreApiAndHook } from '../types.js'
import { getGlobalObject } from '../utils.js'

const globalObject = getGlobalObject('context.ts', {
  reactStoreContext: createContext<{ [key: string]: StoreApiAndHook }>({}),
  initializers: {} as { [key: string]: any },
  pageContextCurrent: null as PageContext | null
})

function setPageContext(pageContext: PageContext | null) {
  globalObject.pageContextCurrent = pageContext
}

function getPageContext() {
  return globalObject.pageContextCurrent
}

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
