import type { PageContext } from 'vike/types'
import { initializers_get, setPageContext } from './context.js'
import { create as createZustand } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getGlobalObject } from '../utils.js'
import getStoresForPage from 'virtual:vike-react-zustand:storeManifest'

// Ensure import.meta.env.SSR works in Node.js without Vite
// @ts-expect-error
import.meta.env ??= { SSR: true }

// Client-side cache (not used in SSR)
const clientCache = import.meta.env.SSR
  ? null
  : getGlobalObject('createStores.ts', {
      initializers: {} as Record<string, any>,
      stores: {} as Record<string, any>,
      fetchOverridden: false,
    })

// Override fetch to include store keys in headers when on client
if (!import.meta.env.SSR && clientCache && !clientCache.fetchOverridden) {
  const originalFetch = globalThis.fetch.bind(globalThis)
  globalThis.fetch = (...args) => {
    // Create a copy of the request to modify
    const [resource, options = {}] = args
    const newOptions = { ...options }

    // Determine if this is a GET request
    const isGetRequest = !options.method || options.method === 'GET'

    // Extract URL from resource regardless of type
    let urlString: string
    if (typeof resource === 'string') {
      urlString = resource
    } else if (resource instanceof URL) {
      urlString = resource.href
    } else if (resource instanceof Request) {
      urlString = resource.url
    } else {
      urlString = String(resource) // Fallback
    }

    const isPageContextRequest = urlString.includes('pageContext.json')

    // Always add the header for GET requests to pageContext.json, even if empty
    if (isGetRequest && isPageContextRequest) {
      // Add headers if they don't exist
      newOptions.headers = new Headers(newOptions.headers || {})

      // Add ALL known store keys as a header (can be empty string)
      const keysString = Object.keys(clientCache.stores).join(',')
      newOptions.headers.set('x-vike-react-zustand-transfer', keysString)
    }

    return originalFetch(resource, newOptions)
  }

  // Mark as overridden to prevent multiple overrides
  clientCache.fetchOverridden = true
}

/**
 * Creates Zustand stores based on initializers.
 * In SSR: Each request gets fresh stores
 * In browser: Stores are cached and only recreated when initializers change
 *
 * @param pageContext The page context
 * @param existingKeys Optional array of store keys that already exist on client
 * @returns Object containing the created stores
 */
export const createStores = (pageContext: PageContext) => {
  const pageId = pageContext.pageId;
  const initializers = initializers_get()
  const result: Record<string, any> = {}

  // Determine which keys to process
  let keysToProcess: string[]

  if (import.meta.env.SSR) {
    // Check for the transfer header to get existing client store keys
    const transferHeader = pageContext.headers?.['x-vike-react-zustand-transfer']
    // Determine which keys already exist on client based on the header
    let existingKeys: string[] = []
    if (transferHeader !== undefined && transferHeader) {
      existingKeys = transferHeader.split(',')
    }
    // On server with client cache info: process only keys not in client cache
    keysToProcess = Object.keys(initializers)
    .filter((key) => !pageId || getStoresForPage(pageId).has(key))
    .filter((key) => !existingKeys.includes(key))
  } else {
    // No cache info or on client: process all keys
    keysToProcess = Object.keys(initializers)
  }

  try {
    setPageContext(pageContext)

    // Process each initializer in our filtered keys list
    for (const key of keysToProcess) {
      const initializer = initializers[key]
      if (!initializer) continue // Skip if initializer doesn't exist

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
    // Only run this when on client
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
