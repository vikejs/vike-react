export { onAfterRenderHtml }

import type { PageContextServer } from 'vike/types'

function onAfterRenderHtml(pageContext: PageContextServer) {
  const configRedux = pageContext.config.redux
  if (!configRedux) return
  pageContext.redux ??= {}
  pageContext.redux.ssrState = pageContext.store.getState()
}
