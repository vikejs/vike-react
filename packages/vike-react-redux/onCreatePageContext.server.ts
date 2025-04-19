export { onCreatePageContext }

import type { PageContextServer } from 'vike/types'
import type { Store } from '@reduxjs/toolkit'

function onCreatePageContext(pageContext: PageContextServer) {
  const createStore = pageContext.config.redux?.createStore
  if (!createStore) return
  pageContext.reduxStore = createStore()
}

declare global {
  namespace Vike {
    interface PageContextServer {
      reduxStore?: Store
    }
  }
}
