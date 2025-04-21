import { mergeWith } from 'lodash-es'
import type { PageContext } from 'vike/types'
import { createStores } from './createStores.js'
import { INITIALIZE_KEY } from '../utils.js'

/**
 * Client-side hook that hydrates stores with server-provided state
 *
 * This function:
 * 1. Creates client-side stores
 * 2. For each store that has server state, merges that state into the client store
 * 3. Marks stores as hydrated to prevent double-hydration
 */
const onBeforeRenderClient = async (pageContext: PageContext) => {
  try {
    // Create all stores
    pageContext._vikeReactZustandExperimentalStores = createStores(pageContext)

    // Skip if no hydration data available
    if (!pageContext._vikeReactZustandExperimentalTransfer) return

    // Hydrate each store that has server data
    for (const [key, store] of Object.entries(pageContext._vikeReactZustandExperimentalStores)) {
      const clientState = store.getInitialState() as any
      const hasServerState = key in pageContext._vikeReactZustandExperimentalTransfer
      const needsHydration = !store.__hydrated__

      if (hasServerState && needsHydration) {
        // Get states to merge
        const serverState = pageContext._vikeReactZustandExperimentalTransfer[key]

        // Merge server state into client state
        mergeWith(clientState, serverState)

        // Mark as hydrated to prevent double-hydration
        store.__hydrated__ = true
      }

      const needsInitialization = !store.__initialized__
      if (needsInitialization) {
        const initialize = clientState[INITIALIZE_KEY]
        if (initialize) {
          const returnValue = await initialize()
          if (returnValue) {
            mergeWith(clientState, returnValue)
          }
        }
        store.__initialized__ = true
      }
    }
  } catch (error) {
    console.error('Error hydrating stores:', error)
    // Continue rendering with client-only state in case of error
  }
}

export default onBeforeRenderClient
