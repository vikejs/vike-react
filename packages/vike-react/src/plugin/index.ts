export { vikeReactClientOnly }

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

/**
 * Vite plugin that transforms <ClientOnly> components:
 * - On server-side: strips the children to remove them from server bundle
 * - Removes unreferenced imports that result from the stripping
 */
function vikeReactClientOnly(): PluginInterop[] {
  const plugins: Plugin[] = [
    {
      name: 'vike-react:client-only',
      enforce: 'pre',
      applyToEnvironment(environment) {
        return environment.name !== 'client'
      },
      transform: {
        order: 'pre',
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
