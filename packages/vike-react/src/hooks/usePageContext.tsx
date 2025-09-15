export { usePageContext }
export { PageContextProvider }

import React, { useContext } from 'react'
import { getGlobalObject } from '../utils/getGlobalObject.js'
import type { PageContext } from 'vike/types'

const globalObject = getGlobalObject('usePageContext.tsx', {
  reactContext: React.createContext<PageContext>(undefined as never),
})

function PageContextProvider({ pageContext, children }: { pageContext: PageContext; children: React.ReactNode }) {
  const { reactContext } = globalObject
  return <reactContext.Provider value={pageContext}>{children}</reactContext.Provider>
}

/**
 * Access `pageContext` from any React component.
 *
 * https://vike.dev/usePageContext
 */
function usePageContext(): PageContext {
  const { reactContext } = globalObject
  const pageContext = useContext(reactContext)
  return pageContext
}
