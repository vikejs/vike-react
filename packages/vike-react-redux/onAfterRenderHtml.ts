export { onAfterRenderHtml }

import type { PageContext } from 'vike/types'

function onAfterRenderHtml(pageContext: PageContext) {
  const store = pageContext.config.redux?.store
  if (store) {
    pageContext.redux ??= {
      state: store.getState(),
    }
  }
}
