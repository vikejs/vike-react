import type { Plugin } from 'vite'

export const config: Plugin = {
  name: 'vike-react-zustand:config',
  configEnvironment(name) {
    return {
      resolve: {
        noExternal: ['vike-react-zustand'],
      },
      optimizeDeps: {
        exclude: ['virtual:vike-react-zustand:storeManifest'],
      },
    }
  },
  configureServer(server) {
    global.vikeReactZustandGlobalState.devServer = server
  },
}
