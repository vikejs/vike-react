export { usePageContext }
export { PageContextProvider }

import React, { useContext } from 'react'
import { getGlobalObject } from '../utils/getGlobalObject.js'
import type { PageContext } from 'vike/types'
import { assert } from '../utils/assert.js'

const globalObject = getGlobalObject('PageContextProvider.ts', {
  reactContext: React.createContext<PageContext>(undefined as never)
})

function PageContextProvider({ pageContext, children }: { pageContext: PageContext; children: React.ReactNode }) {
  assert(pageContext)
  const { reactContext } = globalObject
  return <reactContext.Provider value={pageContext}>{children}</reactContext.Provider>
}

/** Access the pageContext from any React component */
function usePageContext() {
  const { reactContext } = globalObject
  const pageContext = useContext(reactContext)
  /* React throws an error upon wrong hook usage, so I guess a nice error message isn't needed? And I guess we can therefore assume and assert pageContext to have been provided? Let's see if users report back an assert() failure.
  if (!pageContext) throw new Error('<PageContextProvider> is needed for being able to use usePageContext()')
  */
  assert(pageContext)
  return pageContext
}
