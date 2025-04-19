import type { OutputChunk } from 'rollup'
import { Plugin } from 'vite'
import { assert } from '../../utils.js'

export const storeManifestBuild = (): Plugin => {
  const { idToStoreKeys, pagesToStoresMap } = global.vikeReactZustandGlobalState

  return {
    name: 'vike-react-zustand:storeManifestBuild',
    applyToEnvironment(environment) {
      return environment.name === 'client'
    },
    writeBundle(a, b) {
      const pageEntries = Object.entries(b).filter(
        ([key, value]) =>
          'facadeModuleId' in value &&
          value.facadeModuleId &&
          value.facadeModuleId.includes('virtual:vike:pageConfigValuesAll:client:'),
      )

      for (const [key, value] of pageEntries) {
        assert('facadeModuleId' in value && value.facadeModuleId)
        const pageId = value.facadeModuleId.split('virtual:vike:pageConfigValuesAll:client:')[1]
        assert(pageId)
        const storeIds = Object.keys(idToStoreKeys)

        const chunks = new Set<OutputChunk>([value])
        for (const chunk of chunks) {
          for (const import_ of chunk.imports) {
            chunks.add(b[import_] as OutputChunk)
          }
        }

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
