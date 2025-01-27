export { Wrapper }

import React, { useRef } from 'react'
import { Provider } from 'react-redux'
import { usePageContext } from 'vike-react/usePageContext'
import type { Store } from '@reduxjs/toolkit'

function Wrapper({ children }: { children: React.ReactNode }) {
  const pageContext = usePageContext()
  const { redux } = pageContext.config
  const storeRef = useRef<Store>()

  if (!redux?.store) {
    return <>{children}</>
  }

  if (!storeRef.current) {
    storeRef.current = redux.store
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}
