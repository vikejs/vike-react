import type { PageContext } from 'vike/types'
import { removeFunctionsAndUndefined, TRANSFER_STATE_KEY } from '../utils.js'
import { createStores } from './createStores.js'
import { mergeWith } from 'lodash-es'

// Ensure import.meta.env.SSR works in Node.js without Vite
// @ts-expect-error
import.meta.env ??= { SSR: true }

/**
 * Server-side hook that prepares store state for client hydration
 *
 * This function:
 * 1. Creates server-side stores (only those needed by client)
 * 2. Extracts transferable state from each store
 * 3. Attaches this state to pageContext for transfer to client
 */
const onBeforeRender = async (pageContext: PageContext) => {
  // Only run on server
  if (!import.meta.env.SSR) return

  try {
    // Initialize hydration state object if needed
    pageContext._vikeReactZustand ??= {}
    pageContext._stores = createStores(pageContext)

    // Extract and prepare transferable state from each store
    for (const [key, store] of Object.entries(pageContext._stores)) {
      const serverState = store.getInitialState()
      const getStateOnServerSide = serverState[TRANSFER_STATE_KEY]
      if (getStateOnServerSide) {
        const transferableState = removeFunctionsAndUndefined(await getStateOnServerSide())
        mergeWith(serverState, transferableState)

        // Add to hydration data
        pageContext._vikeReactZustand[key] = transferableState
      }
    }
  } catch (error) {
    console.error('Error preparing store state for hydration:', error)
    // Initialize empty hydration state to prevent client-side errors
    pageContext._vikeReactZustand = {}
  }
}

export default onBeforeRender
