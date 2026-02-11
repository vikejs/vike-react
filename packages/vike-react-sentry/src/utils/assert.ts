export { assertUsage }
export { assert }
export { assertWarning }

function assertUsage(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`[vike-react-sentry] ${message}`)
  }
}

function assert(condition: unknown): asserts condition {
  if (condition) return
  throw new Error('You stumbled upon a vike-react-sentry bug, reach out on GitHub.')
}

function assertWarning(condition: unknown, message: string): void {
  if (!condition) {
    console.warn(`[vike-react-sentry][Warning] ${message}`)
  }
}
