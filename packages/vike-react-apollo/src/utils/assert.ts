export { assertUsage }
export { assert }

function assertUsage(condition: unknown, message: string): asserts condition {
  if (condition) return
  throw new Error('[vike-react-apollo] ' + message)
}

function assert(condition: unknown): asserts condition {
  if (condition) return
  throw new Error('[vike-react-apollo] You stumbled upon a bug, reach out on GitHub.')
}
