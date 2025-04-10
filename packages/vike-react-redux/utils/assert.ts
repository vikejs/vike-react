export function assert(condition: unknown): asserts condition {
  if (condition) return
  throw new Error('You stumbled upon a vike-react-redux bug, reach out on GitHub.')
}
