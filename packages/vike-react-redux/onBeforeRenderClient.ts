export { onBeforeRenderClient }

import type { PageContext } from 'vike/types'

function onBeforeRenderClient(pageContext: PageContext) {
  if (pageContext.config.redux) {
    const { createStore } = pageContext.config.redux
    if (createStore) {
      pageContext.reduxStore = createStore(pageContext.reduxState)
    }
  }
}
