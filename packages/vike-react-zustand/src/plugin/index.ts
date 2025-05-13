export { vikeReactZustand }

import type { Plugin } from 'vite'
import { transformCode } from './babelTransformer.js'

function vikeReactZustand(): Plugin[] {
  return [
    {
      name: 'vike-react-zustand:config',
      configEnvironment() {
        return {
          resolve: {
            noExternal: ['vike-react-zustand'],
          },
        }
      },
    },
    {
      name: 'vike-react-zustand:transform',
      enforce: 'post',
      transform(code, id) {
        if (id.includes('node_modules') || !/[jt]sx?$/.test(id)) {
          return
        }
        return transformCode(code, id)
      },
    },
  ]
}
