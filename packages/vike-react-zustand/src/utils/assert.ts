export function assert(condition: unknown): asserts condition {
  if (condition) return
  throw new Error('You stumbled upon a bug in the source code of vite-react-zustand, reach out to a maintainer.')
}
