import type { PageContext } from 'vike/types'
import { INITIALIZE_KEY, removeFunctionsAndUndefined, TRANSFER_KEY } from '../utils.js'
import { createStores } from './createStores.js'
import { mergeWith, pick } from 'lodash-es'

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
    pageContext._vikeReactZustandExperimentalTransfer ??= {}
    pageContext._vikeReactZustandExperimentalStores = createStores(pageContext)

    // Extract and prepare transferable state from each store
    for (const [key, store] of Object.entries(pageContext._vikeReactZustandExperimentalStores)) {
      const serverState = store.getInitialState() as any
      const getStateOnServerSide = serverState[TRANSFER_KEY]
      let transferKeys: string[] = []
      if (getStateOnServerSide) {
        const transferableState = removeFunctionsAndUndefined(await getStateOnServerSide())
        mergeWith(serverState, transferableState)
        transferKeys = Object.keys(transferableState)
      }

      const initialize = serverState[INITIALIZE_KEY]
      if (initialize) {
        const returnValue = await initialize()
        if (returnValue) {
          mergeWith(serverState, returnValue)
        }
      }

      // Add to hydration data
      pageContext._vikeReactZustandExperimentalTransfer[key] = pick(store.getState(), transferKeys)
    }
  } catch (error) {
    console.error('Error preparing store state for hydration:', error)
    // Initialize empty hydration state to prevent client-side errors
    pageContext._vikeReactZustandExperimentalTransfer = {}
  }
}

export default onBeforeRender
