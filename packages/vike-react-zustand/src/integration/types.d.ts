export type {}

// The types we add here aren't visible to the user (because this file only matches the TypeScript rootDir of packages/vike-react-zustand/tsconfig.json)

declare global {
  namespace Vike {
    interface PageContext {
      _vikeReactZustandState: Record<string, unknown>
      _vikeReactZustandStores: { [key: string]: ReturnType<typeof import('../createStores.ts').createStore_> }
    }
  }
}

declare module 'zustand' {
  interface StoreApi<T> {
    __hydrated__?: boolean
  }
}
