export { onAfterRenderHtml }

import type { PageContextServer } from 'vike/types'

function onAfterRenderHtml(pageContext: PageContextServer) {
  const reduxConfig = pageContext.config.redux
  if (!reduxConfig) return
  pageContext.redux ??= {}
  pageContext.redux.ssrState = pageContext.store.getState()
}
