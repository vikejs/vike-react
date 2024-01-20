export { PageContextProvider }
export { usePageContext }
export { useData }
export { providePageContextSynchronously }

import React, { useContext } from 'react'
import { getGlobalObject } from './utils/getGlobalObject.js'
import type { PageContext } from 'vike/types'
import { assert } from './utils/assert.js'

const globalObject = getGlobalObject('PageContextProvider.ts', {
  reactContext: React.createContext<PageContext>(undefined as never),
  pageContextProvidedSynchronously: null as null | PageContext
})

function PageContextProvider({ pageContext, children }: { pageContext: PageContext; children: React.ReactNode }) {
  assert(pageContext)
  const { reactContext } = globalObject
  return <reactContext.Provider value={pageContext}>{children}</reactContext.Provider>
}

function providePageContextSynchronously(pageContext: PageContext) {
  globalObject.pageContextProvidedSynchronously = pageContext
  const clear = () => {
    globalObject.pageContextProvidedSynchronously = null
  }
  return clear
}

/** Access the pageContext from any React component */
function usePageContext() {
  if (globalObject.pageContextProvidedSynchronously) return globalObject.pageContextProvidedSynchronously
  const { reactContext } = globalObject
  const pageContext = useContext(reactContext)
  if (!pageContext) throw new Error('<PageContextProvider> is needed for being able to use usePageContext()')
  return pageContext
}
function useData<Data>(): Data {
  const { data } = usePageContext() as any
  return data
}
