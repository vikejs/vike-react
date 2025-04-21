import React, { ReactNode } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { assert } from '../utils.js'
import { getReactStoreContext } from './context.js'

export default function Wrapper({ children }: { children: ReactNode }) {
  const pageContext = usePageContext()
  const reactStoreContext = getReactStoreContext()
  assert(reactStoreContext)
  return <reactStoreContext.Provider value={pageContext._vikeReactZustandExperimentalStores}>{children}</reactStoreContext.Provider>
}
