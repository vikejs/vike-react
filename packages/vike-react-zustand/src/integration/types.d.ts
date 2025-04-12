export type {}

// The types we add here aren't visible to the user (because this file only matches the TypeScript rootDir of packages/vike-react-zustand/tsconfig.json)

declare global {
  namespace Vike {
    interface PageContext {
      _vikeReactZustand: Record<string, unknown>
      _stores: ReturnType<typeof import('./createStores.ts').createStores>
    }
  }
}

declare module 'zustand' {
  interface StoreApi<T> {
    __hydrated__?: boolean
  }
}
