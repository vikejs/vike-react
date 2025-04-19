export { onCreatePageContext }

import type { PageContextServer } from 'vike/types'

function onCreatePageContext(pageContext: PageContextServer) {
  const reduxConfig = pageContext.config.redux
  if (!reduxConfig) return
  pageContext.redux = { store: reduxConfig.createStore(pageContext) }
}
