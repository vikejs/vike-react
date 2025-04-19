import { uneval } from 'devalue'
import type { Plugin } from 'vite'
import { assert } from '../../utils.js'

export const storeManifestVirtual = (): Plugin => {
  return {
    name: 'vike-react-zustand:storeManifestVirtual',
    resolveId(source) {
      if (source === 'virtual:vike-react-zustand:storeManifest') {
        return '\0' + source
      }
    },
    async load(id) {
      if (id !== '\0virtual:vike-react-zustand:storeManifest') {
        return
      }

      // Client-side: always return true
      if (this.environment.name !== 'ssr') {
        return `export default () => ({ has: () => true })`
      }

      // SSR build mode: serialize the map
      if (this.environment.mode === 'build') {
        const { pagesToStoresMap } = global.vikeReactZustandGlobalState
        return `const pagesToStoresMap = ${uneval(pagesToStoresMap)}; export default (pageId) => pagesToStoresMap[pageId] || ({has: () => true})`
      }

      // SSR dev mode: create dynamic function
      assert(this.environment.mode === 'dev')

      // Set up the dynamic function that will be called at runtime
      global.vikeReactZustandGlobalState.getStoresForPage = (pageId) => {
        const { devServer, idToStoreKeys } = global.vikeReactZustandGlobalState
        global.vikeReactZustandGlobalState.pagesToStoresMap = {}
        const { pagesToStoresMap } = global.vikeReactZustandGlobalState

        // Find the page module
        const serverEnv = devServer!.environments.ssr
        const url = `\0virtual:vike:pageConfigValuesAll:server:${pageId}`
        const pageModule = serverEnv.moduleGraph.getModuleById(url)
        if (!pageModule) {
          return { has: () => true as const }
        }

        // Process each store module
        for (const [storeModuleId, storeKeys] of Object.entries(idToStoreKeys)) {
          const storeModule = serverEnv.moduleGraph.getModuleById(storeModuleId)
          if (!storeModule) continue

          // Collect all importers (direct and indirect)
          const importers = new Set(storeModule.importers)
          for (const importer of importers) {
            for (const innerImporter of importer.importers) {
              importers.add(innerImporter)
            }
          }

          // Check if page uses this store
          for (const importer of importers) {
            for (const storeKey of storeKeys) {
              if (importer.id === pageModule.id) {
                pagesToStoresMap[pageId] ||= new Set()
                pagesToStoresMap[pageId].add(storeKey)
              }
            }
          }
        }

        return pagesToStoresMap[pageId] || { has: () => true as const }
      }

      return `export default global.vikeReactZustandGlobalState.getStoresForPage`
    },
  }
}
