export { vikeReactZustand }

import type { Plugin, ViteDevServer } from 'vite'
import { config } from './plugins/config.js'
import { storeManifestBuild } from './plugins/storeManifestBuild.js'
import { storeManifestVirtual } from './plugins/storeManifestVirtual.js'
import { transform } from './plugins/transform.js'

type GlobalState = {
  idToStoreKeys: { [id: string]: Set<string> }
  pagesToStoresMap: { [id: string]: Set<string> }
  getStoresForPage: (pageId: string) => Set<string> | { has: () => true }
  devServer: ViteDevServer | null
}

declare global {
  var vikeReactZustandGlobalState: GlobalState
}

global.vikeReactZustandGlobalState ||= {
  idToStoreKeys: {},
  pagesToStoresMap: {},
  getStoresForPage: () => ({
    has: () => true as const,
  }),
  devServer: null,
}

function vikeReactZustand(): Plugin[] {
  return [config, transform(), storeManifestBuild(), storeManifestVirtual()]
}
