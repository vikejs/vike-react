export { assert, assertUsage }

function assert(condition: unknown): asserts condition {
  if (condition) return
  throw new Error("You stumbled upon a bug in vike-react-apollo's source code, reach out on GitHub.")
}

function assertUsage(condition: unknown, message: string): asserts condition {
  if (condition) return
  throw new Error('Wrong usage: ' + message)
}
