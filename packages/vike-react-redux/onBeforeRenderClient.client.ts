export { onBeforeRenderClient }

import type { PageContextClient } from 'vike/types'

function onBeforeRenderClient(pageContext: PageContextClient) {
  const reduxConfig = pageContext.config.redux
  if (!reduxConfig) return
  pageContext.globalContext.store ??= reduxConfig.createStore(pageContext)
}
