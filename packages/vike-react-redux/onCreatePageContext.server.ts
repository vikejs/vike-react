export { onCreatePageContext }

import type { PageContextServer } from 'vike/types'

function onCreatePageContext(pageContext: PageContextServer) {
  const configRedux = pageContext.config.redux
  if (!configRedux) return
  pageContext.store = configRedux.createStore(pageContext)
}
