export { onBeforeRenderHtml }

import { PageContext } from 'vike/types'

function onBeforeRenderHtml(pageContext: PageContext) {
  if (pageContext.config.redux) {
    const createStore = pageContext.config.redux.createStore
    if (createStore) {
      pageContext.config.redux.store = createStore()
    }
  }
}
