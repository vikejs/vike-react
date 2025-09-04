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
        handler(code, id) {
          if (id.includes('node_modules') || !/[jt]sx?$/.test(id)) {
            return
          }
          return transformCode(code, id)
        },
      },
    },
  ]
  return plugins as any
}
