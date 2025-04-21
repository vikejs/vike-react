import type { PageContext } from 'vike/types'
import { initializers_get, setPageContext } from './context.js'
import { create as createZustand } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getGlobalObject } from '../utils.js'
import getStoresForPage from 'virtual:vike-react-zustand-experimental:storeManifest'

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
    const [resource, options = {}] = args
    const newOptions = { ...options }
    const isGetRequest = !options.method || options.method === 'GET'
    let urlString: string
    if (typeof resource === 'string') {
      urlString = resource
    } else if (resource instanceof URL) {
      urlString = resource.href
    } else if (resource instanceof Request) {
      urlString = resource.url
    } else {
      urlString = String(resource)
    }

    const isPageContextRequest = urlString.includes('pageContext.json')
    if (isGetRequest && isPageContextRequest) {
      newOptions.headers = new Headers(newOptions.headers || {})
      const keysString = Object.keys(clientCache.stores).join(',')
      newOptions.headers.set('x-vike-react-zustand-experimental-notransfer', keysString)
    }

    return originalFetch(resource, newOptions)
  }

  clientCache.fetchOverridden = true
}

export const createStores = (pageContext: PageContext) => {
  const pageId = pageContext.pageId
  const initializers = initializers_get()
  const result: Record<string, ReturnType<typeof createStore>> = {}

  let keysToProcess: string[]
  if (import.meta.env.SSR) {
    const transferHeader = pageContext.headers?.['x-vike-react-zustand-experimental-notransfer']
    let existingKeys: string[] = []
    if (transferHeader !== undefined && transferHeader) {
      existingKeys = transferHeader.split(',')
    }
    keysToProcess = Object.keys(initializers)
      .filter((key) => !pageId || getStoresForPage(pageId).has(key))
      .filter((key) => !existingKeys.includes(key))
  } else {
    keysToProcess = Object.keys(initializers)
  }

  try {
    setPageContext(pageContext)

    for (const key of keysToProcess) {
      const initializer = initializers[key]
      if (!initializer) continue

      const needsNewStore = import.meta.env.SSR || !clientCache || clientCache.initializers[key] !== initializer

      if (needsNewStore) {
        const store = createStore(initializer)
        result[key] = store

        if (!import.meta.env.SSR && clientCache) {
          clientCache.stores[key] = store
          clientCache.initializers[key] = initializer
        }
      } else {
        result[key] = clientCache.stores[key]
      }
    }

    if (!import.meta.env.SSR && clientCache) {
      Object.keys(clientCache.stores).forEach((key) => {
        if (!(key in initializers)) {
          delete clientCache.stores[key]
          delete clientCache.initializers[key]
        }
      })
    }
  } finally {
    setPageContext(null)
  }

  return result
}

function createStore(initializer: any) {
  return createZustand()(devtools(initializer))
}
