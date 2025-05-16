export { Wrapper }

import React from 'react'
import { Provider } from 'react-redux'
import { usePageContext } from 'vike-react/usePageContext'
import type { Store } from '@reduxjs/toolkit'

function Wrapper({ children }: { children: React.ReactNode }) {
  const pageContext = usePageContext()
  let store: undefined | Store
  if (pageContext.isClientSide) {
    store = pageContext.globalContext.store
  } else {
    store = pageContext.store
  }
  if (!store) return <>{children}</>
  return <Provider store={store}>{children}</Provider>
}
