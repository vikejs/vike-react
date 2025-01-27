export { onBeforeRenderClient }

import { PageContext } from 'vike/types'

function onBeforeRenderClient(pageContext: PageContext) {
  if (pageContext.config.redux) {
    const createStore = pageContext.config.redux.createStore
    if (createStore) {
      pageContext.config.redux.store = createStore(pageContext.redux?.state)
    }
  }
}
