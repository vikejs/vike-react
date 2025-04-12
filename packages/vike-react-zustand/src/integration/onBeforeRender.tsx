import type { PageContext } from 'vike/types'
import { removeFunctionsAndUndefined, TRANSFER_STATE_KEY } from '../utils.js'
import { createStores } from './createStores.js'

// Ensure import.meta.env.SSR works in Node.js without Vite
// @ts-expect-error
import.meta.env ??= { SSR: true }

/**
 * Server-side hook that prepares store state for client hydration
 *
 * This function:
 * 1. Creates server-side stores
 * 2. Extracts transferable state from each store
 * 3. Attaches this state to pageContext for transfer to client
 */
const onBeforeRender = (pageContext: PageContext) => {
  // Only run on server
  if (!import.meta.env.SSR) return

  try {
    // Create all stores
    pageContext._stores = createStores(pageContext)

    // Initialize hydration state object if needed
    pageContext._vikeReactZustand ??= {}

    // Extract and prepare transferable state from each store
    for (const [key, store] of Object.entries(pageContext._stores)) {
      const transferableState = removeFunctionsAndUndefined(store.getState()[TRANSFER_STATE_KEY])

      // Add to hydration data
      pageContext._vikeReactZustand[key] = transferableState
    }
  } catch (error) {
    console.error('Error preparing store state for hydration:', error)
    // Initialize empty hydration state to prevent client-side errors
    pageContext._vikeReactZustand = {}
  }
}

export default onBeforeRender
