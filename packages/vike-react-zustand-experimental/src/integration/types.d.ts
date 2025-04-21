export type {}

// The types we add here aren't visible to the user (because this file only matches the TypeScript rootDir of packages/vike-react-zustand-experimental/tsconfig.json)

declare global {
  namespace Vike {
    interface PageContext {
      _vikeReactZustandExperimentalTransfer: Record<string, unknown>
      _vikeReactZustandExperimentalStores: ReturnType<typeof import('./createStores.ts').createStores>
    }
  }
}

declare module 'zustand' {
  interface StoreApi<T> {
    __hydrated__?: boolean
    __initialized__?: boolean
  }
}
