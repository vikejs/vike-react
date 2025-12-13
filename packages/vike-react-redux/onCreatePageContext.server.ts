export { onCreatePageContext }

import type { PageContextServer } from 'vike/types'

function onCreatePageContext(pageContext: PageContextServer) {
  if (pageContext.isClientSideNavigation || !pageContext.Page) return // only SSR
  const configRedux = pageContext.config.redux
  if (!configRedux) return
  pageContext.store = configRedux.createStore(pageContext)
}
