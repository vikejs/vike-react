export { onAfterRenderHtml }

import type { PageContextServer } from 'vike/types'
import { assert } from './utils/assert'

function onAfterRenderHtml(pageContext: PageContextServer) {
  if (!pageContext.redux) return
  pageContext.redux.ssrState = pageContext.redux.store.getState()
  assert(pageContext.redux.ssrState)
}
