export function assert(condition: unknown): asserts condition {
  if (condition) return
  throw new Error('[vike-react-query] You stumbled upon a bug, reach out on GitHub.')
}
