export { onBeforeRenderHtml }

import type { PageContext } from 'vike/types'

function onBeforeRenderHtml(pageContext: PageContext) {
  if (pageContext.config.redux) {
    const { createStore } = pageContext.config.redux
    if (createStore) {
      pageContext.reduxStore = createStore()
    }
  }
}
