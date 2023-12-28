export type {}

declare global {
  namespace Vike {
    interface PageContext {
      vikeReactZustand: Record<string, unknown>
    }
  }
}
