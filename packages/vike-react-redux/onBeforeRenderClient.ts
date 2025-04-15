export { onBeforeRenderClient }

import type { PageContextClient } from 'vike/types'

function onBeforeRenderClient(pageContext: PageContextClient) {
  const createStore = pageContext.config.redux?.createStore
  if (!createStore) return
  if (pageContext.isHydration) {
    pageContext.reduxStore = createStore(pageContext.reduxState)
  }
}
