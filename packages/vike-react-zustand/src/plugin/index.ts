export { vikeReactZustand }

import type { Plugin } from 'vite'
import { transformCode } from './babelTransformer.js'
import { assert } from '../utils/assert.js'

const skipNonJsFiles = /\.[jt]sx?$/
const skipNodeModules = /node_modules/
const filterRolldown = {
  id: {
    include: skipNonJsFiles,
    exclude: skipNodeModules,
  },
}
const filterFunction = (id: string) => skipNonJsFiles.test(id) && !skipNodeModules.test(id)

type PluginInterop = Record<string, unknown> & { name: string }
// Return `PluginInterop` instead of `Plugin` to avoid type mismatch upon different Vite versions
function vikeReactZustand(): PluginInterop[] {
  const plugins: Plugin[] = [
    {
      name: 'vike-react-zustand:config',
      configEnvironment: {
        handler() {
          return {
            resolve: {
              noExternal: ['vike-react-zustand'],
            },
          }
        },
      },
    },
    {
      name: 'vike-react-zustand:transform',
      enforce: 'post',
      transform: {
        // Hook filter to only process JavaScript/TypeScript files and exclude node_modules
        filter: filterRolldown,
        handler(code, id) {
          assert(filterFunction(id))

          // The filter above already handles the file type and node_modules check
          // so we can remove the redundant checks here
          return transformCode(code, id)
        },
      },
    },
  ]
  return plugins as any
}
