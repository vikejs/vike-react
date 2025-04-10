export { onAfterRenderHtml }

import type { PageContextServer } from 'vike/types'

function onAfterRenderHtml(pageContext: PageContextServer) {
  const { reduxStore } = pageContext
  if (!reduxStore) return
  pageContext.reduxState = reduxStore.getState()
}
