import type { Plugin } from 'vite'

export const config: Plugin = {
  name: 'vike-react-zustand-experimental:config',
  configEnvironment(name) {
    return {
      resolve: {
        noExternal: ['vike-react-zustand-experimental'],
      },
      optimizeDeps: {
        exclude: ['virtual:vike-react-zustand-experimental:storeManifest'],
      },
    }
  },
  configureServer(server) {
    global.vikeReactZustandExperimentalGlobalState.devServer = server
  },
}
