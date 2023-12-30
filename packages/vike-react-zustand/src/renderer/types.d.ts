export type {}

declare global {
  namespace Vike {
    interface PageContext {
      vikeReactZustand: Record<string, unknown>
    }
  }
}

declare module 'zustand' {
  interface StoreApi<T> {
    __hydrated__?: boolean
  }
}
