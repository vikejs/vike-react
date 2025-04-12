import type { PageContext } from 'vike/types'
import { initializers_get, setPageContext } from './context.js'
import { create as createZustand } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getGlobalObject } from '../utils.js'

// Ensure import.meta.env.SSR works in Node.js without Vite
// @ts-expect-error
import.meta.env ??= { SSR: true }

// Client-side cache (not used in SSR)
const clientCache = import.meta.env.SSR
  ? null
  : getGlobalObject('createStores.ts', {
      initializers: {} as Record<string, any>,
      stores: {} as Record<string, any>,
    })

/**
 * Creates Zustand stores based on initializers.
 * In SSR: Each request gets fresh stores
 * In browser: Stores are cached and only recreated when initializers change
 */
export const createStores = (pageContext: PageContext) => {
  const initializers = initializers_get()
  const result: Record<string, any> = {}

  try {
    setPageContext(pageContext)

    // Process each initializer
    for (const [key, initializer] of Object.entries(initializers)) {
      // Determine if we need to create a new store
      const needsNewStore = import.meta.env.SSR || !clientCache || clientCache.initializers[key] !== initializer

      if (needsNewStore) {
        // Create a new store
        const store = createStore(initializer)
        result[key] = store

        // Update client cache if in browser
        if (!import.meta.env.SSR && clientCache) {
          clientCache.stores[key] = store
          clientCache.initializers[key] = initializer
        }
      } else {
        // Reuse cached store
        result[key] = clientCache.stores[key]
      }
    }

    // Clean up client cache for removed initializers
    if (!import.meta.env.SSR && clientCache) {
      Object.keys(clientCache.stores).forEach((key) => {
        if (!(key in initializers)) {
          delete clientCache.stores[key]
          delete clientCache.initializers[key]
        }
      })
    }
  } finally {
    // Always reset pageContext when done
    setPageContext(null)
  }

  return result
}

/**
 * Creates a Zustand store with devtools middleware
 */
function createStore(initializer: any) {
  return createZustand()(devtools(initializer))
}
