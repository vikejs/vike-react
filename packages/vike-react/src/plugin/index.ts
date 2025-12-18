export { vikeReactClientOnly }

import type { Plugin } from 'vite'
import { transformCode, type TransformOptions } from './babelTransformer.js'
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

// Default rules for vike-react
const defaultOptions: TransformOptions = {
  rules: [
    // jsx/jsxs/jsxDEV: children is a prop in arg 1
    {
      call: {
        match: ['jsx', 'jsxs', 'jsxDEV'],
        args: { 0: 'import:vike-react/ClientOnly:ClientOnly' },
        remove: { arg: 1, prop: 'children' },
      },
    },
    // createElement: children are rest args starting at index 2
    {
      call: {
        match: 'createElement',
        args: { 0: 'import:vike-react/ClientOnly:ClientOnly' },
        remove: { argsFrom: 2 },
      },
    },
  ],
}

/**
 * Vite plugin that transforms JSX components on server-side:
 * - Strips specified props (e.g., children) from components
 * - Removes unreferenced imports that result from the stripping
 */
function vikeReactClientOnly() {
  const plugins: Plugin[] = [
    {
      name: 'vike-react:client-only',
      enforce: 'post',
      applyToEnvironment(environment) {
        return environment.name !== 'client'
      },
      transform: {
        filter: filterRolldown,
        handler(code, id) {
          assert(filterFunction(id))
          return transformCode(code, id, defaultOptions)
        },
      },
    },
  ]

  return plugins
}
