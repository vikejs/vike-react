export { Wrapper }

import React, { useRef } from 'react'
import { Provider } from 'react-redux'
import { usePageContext } from 'vike-react/usePageContext'
import type { Store } from '@reduxjs/toolkit'

function Wrapper({ children }: { children: React.ReactNode }) {
  const pageContext = usePageContext()
  const storeRef = useRef<Store>()

  if (!pageContext.config.redux) {
    return <>{children}</>
  }

  if (!storeRef.current) {
    storeRef.current = pageContext.reduxStore
  }

  return <Provider store={storeRef.current!}>{children}</Provider>
}
