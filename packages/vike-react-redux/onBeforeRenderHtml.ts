export { onBeforeRenderHtml }

import type { PageContext } from 'vike/types'

function onBeforeRenderHtml(pageContext: PageContext) {
  const createStore = pageContext.config.redux?.createStore
  if (!createStore) return
  pageContext.reduxStore = createStore(pageContext.serverState)
}
