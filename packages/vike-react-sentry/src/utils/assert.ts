export { assertUsage }
export { assert }
export { assertWarning }

function assertUsage(condition: unknown, message: string): asserts condition {
  if (condition) return
  throw new Error(`[vike-react-sentry] ${message}`)
}

function assert(condition: unknown): asserts condition {
  if (condition) return
  throw new Error('[vike-react-sentry] You stumbled upon a bug, reach out on GitHub.')
}

function assertWarning(condition: unknown, message: string): void {
  if (condition) return
  console.warn(`[vike-react-sentry][Warning] ${message}`)
}
