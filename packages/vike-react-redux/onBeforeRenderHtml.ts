export { onBeforeRenderHtml }

import type { PageContextServer } from 'vike/types'

function onBeforeRenderHtml(pageContext: PageContextServer) {
  const createStore = pageContext.config.redux?.createStore
  if (!createStore) return
  pageContext.reduxStore = createStore(pageContext.serverState)
}
