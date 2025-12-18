export { assertUsage }
export { assert }

function assertUsage(condition: unknown, message: string): asserts condition {
  if (condition) return
  throw new Error('Wrong usage: ' + message)
}

function assert(condition: unknown): asserts condition {
  if (condition) return
  throw new Error('You stumbled upon a vike-react-apollo bug, reach out on GitHub.')
}
