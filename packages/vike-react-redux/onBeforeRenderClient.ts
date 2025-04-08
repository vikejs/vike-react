export { onBeforeRenderClient }

import type { PageContext } from 'vike/types'

function onBeforeRenderClient(pageContext: PageContext) {
  const createStore = pageContext.config.redux?.createStore
  if (!createStore) return
  pageContext.reduxStore = createStore(pageContext.reduxState)
}
