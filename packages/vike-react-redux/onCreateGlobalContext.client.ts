export { onCreateGlobalContext }

import type { GlobalContextClient } from 'vike/types'

function onCreateGlobalContext(globalContext: GlobalContextClient) {
  const reduxConfig = globalContext.config.redux
  if (!reduxConfig) return
  if (reduxConfig.createStoreAlwaysEarly === undefined) return
  globalContext.redux = { store: reduxConfig.createStore(globalContext) }
}
