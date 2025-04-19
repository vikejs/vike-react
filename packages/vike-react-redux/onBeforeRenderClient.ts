export { onBeforeRenderClient }

import type { PageContextClient } from 'vike/types'
import type { Store } from '@reduxjs/toolkit'

function onBeforeRenderClient(pageContext: PageContextClient) {
  const createStore = pageContext.config.redux?.createStore
  if (!createStore) return
  pageContext.globalContext.reduxStore = createStore(pageContext.reduxState)
}

declare global {
  namespace Vike {
    interface GlobalContextClient {
      reduxStore?: Store
    }
  }
}
