export { assert }

function assert(condition: unknown): asserts condition {
  if (condition) return
  throw new Error('[vike-react-zustand] You stumbled upon a bug, reach out on GitHub.')
}
