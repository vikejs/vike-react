export { Wrapper }

import React from 'react'
import { Provider } from 'react-redux'
import { usePageContext } from 'vike-react/usePageContext'
import type { Store } from '@reduxjs/toolkit'

function Wrapper({ children }: { children: React.ReactNode }) {
  const pageContext = usePageContext()
  let reduxStore: undefined | Store
  if (pageContext.isClientSide) {
    reduxStore = pageContext.globalContext.reduxStore
  } else {
    reduxStore = pageContext.reduxStore
  }
  if (!reduxStore) return <>{children}</>
  return <Provider store={reduxStore}>{children}</Provider>
}
