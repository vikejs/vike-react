export { vikeReactZustand }

import type { Plugin } from 'vite'
import { transformCode } from './babelTransformer.js'
import { assert } from '../utils/assert.js'

const skipNonJsFiles = /\.[jt]sx?$/
const skipNodeModules = 'node_modules'
const filterRolldown = {
  id: {
    include: skipNonJsFiles,
    exclude: `**/${skipNodeModules}/**`,
  },
}
const filterFunction = (id: string) => {
  if (id.includes(skipNodeModules)) return false
  if (!skipNonJsFiles.test(id)) return false
  return true
}

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
        filter: filterRolldown,
        handler(code, id) {
          assert(filterFunction(id))
          return transformCode(code, id)
        },
      },
    },
  ]
  return plugins as any
}
