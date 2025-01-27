export { onAfterRenderHtml }

import { PageContext } from 'vike/types'

function onAfterRenderHtml(pageContext: PageContext) {
  if (pageContext.config.redux?.store) {
    const store = pageContext.config.redux.store

    pageContext.redux ??= {
      state: store?.getState(),
    }
  }
}
