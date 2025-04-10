export { onBeforeRenderClient }

import type { PageContextClient } from 'vike/types'
import { assert } from './utils/assert'

function onBeforeRenderClient(pageContext: PageContextClient) {
  const createStore = pageContext.config.redux?.createStore
  if (!createStore) return
  if (!pageContext.isHydration) assert(pageContext.reduxStore)
  pageContext.reduxStore = createStore(pageContext.reduxState)
}
