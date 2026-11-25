export { assertUsage }
export { assertWarning }

function assertUsage(condition: unknown, message: string): asserts condition {
  if (condition) return
  throw new Error(`[vike-react-sentry] ${message}`)
}

function assertWarning(condition: unknown, message: string): void {
  if (condition) return
  console.warn(`[vike-react-sentry][Warning] ${message}`)
}
