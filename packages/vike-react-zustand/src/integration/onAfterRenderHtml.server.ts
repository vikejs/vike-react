export { onAfterRenderHtml }

import type { PageContextServer } from 'vike/types'
import { removeFunctionsAndUndefined } from '../utils/removeFunctionsAndUndefined.js'

function onAfterRenderHtml(pageContext: PageContextServer) {
  if (!pageContext._vikeReactZustandStores) return
  try {
    pageContext._vikeReactZustandState = {}
    // Extract and prepare transferable state from each store
    for (const [key, store] of Object.entries(pageContext._vikeReactZustandStores)) {
      const serverState = store.getInitialState() as any
      const transferableState = removeFunctionsAndUndefined(serverState)
      pageContext._vikeReactZustandState[key] = transferableState
    }
    console.log(pageContext._vikeReactZustandState, pageContext._vikeReactZustandStores)
  } catch (error) {
    console.error('Error preparing store state for hydration:', error)
    pageContext._vikeReactZustandState = {}
  }
}
