export { assertUsage }

function assertUsage(condition: unknown, message: string): asserts condition {
  if (condition) return
  throw new Error('Wrong usage: ' + message)
}
