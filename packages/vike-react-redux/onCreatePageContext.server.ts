export { onCreatePageContext }

import type { PageContextServer } from 'vike/types'

function onCreatePageContext(pageContext: PageContextServer) {
  const createStore = pageContext.config.redux?.createStore
  if (!createStore) return
  pageContext.redux = { store: createStore(pageContext) }
}
