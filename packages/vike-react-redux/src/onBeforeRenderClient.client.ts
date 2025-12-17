export { onBeforeRenderClient }

import type { PageContextClient } from 'vike/types'

function onBeforeRenderClient(pageContext: PageContextClient) {
  const configRedux = pageContext.config.redux
  if (!configRedux) return
  pageContext.globalContext.store ??= configRedux.createStore(pageContext)
}
