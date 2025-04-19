import type { Plugin } from 'vite'
import { assert } from '../../utils.js'

export const storeManifestBuild = (): Plugin => {
  const { idToStoreKeys, pagesToStoresMap } = global.vikeReactZustandGlobalState

  return {
    name: 'vike-react-zustand:storeManifestBuild',
    applyToEnvironment(environment) {
      return environment.name === 'client'
    },
    writeBundle(_, bundleInfo) {
      // Find page entries and map them to their stores
      const pageEntries = Object.entries(bundleInfo).filter(
        ([_, value]) =>
          'facadeModuleId' in value &&
          value.facadeModuleId &&
          value.facadeModuleId.includes('virtual:vike:pageConfigValuesAll:client:'),
      )

      for (const [_, value] of pageEntries) {
        assert('facadeModuleId' in value && value.facadeModuleId)
        const pageId = value.facadeModuleId.split('virtual:vike:pageConfigValuesAll:client:')[1]
        assert(pageId)

        type OutputChunk = typeof value
        // Collect all chunks (direct and indirect imports)
        const chunks = new Set<OutputChunk>([value])
        for (const chunk of chunks) {
          for (const import_ of chunk.imports) {
            chunks.add(bundleInfo[import_] as OutputChunk)
          }
        }

        // Map stores to page
        const storeIds = Object.keys(idToStoreKeys)
        for (const chunk of chunks) {
          for (const storeId of storeIds) {
            if (chunk.moduleIds.includes(storeId)) {
              pagesToStoresMap[pageId] ||= new Set()
              for (const storeKey of idToStoreKeys[storeId]!) {
                pagesToStoresMap[pageId].add(storeKey)
              }
            }
          }
        }
      }
    },
  }
}
