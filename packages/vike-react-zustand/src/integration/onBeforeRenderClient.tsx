import { mergeWith } from 'lodash-es'
import type { PageContext } from 'vike/types'
import { assert } from '../utils.js'
import { createStores } from './createStores.js'

/**
 * Client-side hook that hydrates stores with server-provided state
 *
 * This function:
 * 1. Creates client-side stores
 * 2. For each store that has server state, merges that state into the client store
 * 3. Marks stores as hydrated to prevent double-hydration
 */
const onBeforeRenderClient = (pageContext: PageContext) => {
  try {
    // Create all stores
    pageContext._stores = createStores(pageContext)

    // Skip if no hydration data available
    if (!pageContext._vikeReactZustand) return

    // Hydrate each store that has server data
    for (const [key, store] of Object.entries(pageContext._stores)) {
      const hasServerState = key in pageContext._vikeReactZustand
      const needsHydration = !store.__hydrated__

      if (hasServerState && needsHydration) {
        // Get states to merge
        const clientState = store.getInitialState()
        const serverState = pageContext._vikeReactZustand[key]

        // Merge server state into client state
        mergeWith(clientState, serverState)

        // Mark as hydrated to prevent double-hydration
        store.__hydrated__ = true
      }
    }
  } catch (error) {
    console.error('Error hydrating stores:', error)
    // Continue rendering with client-only state in case of error
  }
}

export default onBeforeRenderClient
