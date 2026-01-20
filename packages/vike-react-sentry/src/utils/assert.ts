export { assertUsage }
export { assert }

function assertUsage(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`[vike-react-sentry] ${message}`)
  }
}

function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(`[vike-react-sentry] ${message}`)
  }
}
