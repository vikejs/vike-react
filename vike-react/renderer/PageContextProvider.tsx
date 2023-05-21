export { PageContextProvider }
export { usePageContext }

import React, { useContext } from 'react'
import { PageContext } from './types'
import { getGlobalObject } from './utils/getGlobalObject'

const { Context } = getGlobalObject('PageContextProvider.ts', {
  Context: React.createContext<PageContext>(undefined as never)
})

function PageContextProvider({ pageContext, children }: { pageContext: PageContext; children: React.ReactNode }) {
  if (!pageContext) throw new Error('Argument pageContext missing')
  return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

/** Access the pageContext from any React component */
function usePageContext() {
  const pageContext = useContext(Context)
  if (!pageContext) throw new Error('<PageContextProvider> is needed for being able to use usePageContext()')
  return pageContext
}
