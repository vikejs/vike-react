export { vikeReactZustand }

import type { Plugin } from 'vite'
import { transformCode } from './babelTransformer.js'

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
        filter: {
          id: {
            include: /\.[jt]sx?$/,
            exclude: /node_modules/,
          },
        },
        handler(code, id) {
          // The filter above already handles the file type and node_modules check
          // so we can remove the redundant checks here
          return transformCode(code, id)
        },
      },
    },
  ]
  return plugins as any
}
