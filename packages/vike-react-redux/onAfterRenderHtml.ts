export { onAfterRenderHtml }

import type { PageContextServer } from 'vike/types'

function onAfterRenderHtml(pageContext: PageContextServer) {
  if (!pageContext.redux) return
  pageContext.redux.ssrState = pageContext.redux.store.getState()
}
