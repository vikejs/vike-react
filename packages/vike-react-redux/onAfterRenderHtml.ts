export { onAfterRenderHtml }

import type { PageContext } from 'vike/types'

function onAfterRenderHtml(pageContext: PageContext) {
  const { reduxStore } = pageContext
  if (!reduxStore) return
  pageContext.reduxState = reduxStore.getState()
}
