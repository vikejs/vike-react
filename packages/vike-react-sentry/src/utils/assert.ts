export { assertWarning }

function assertWarning(condition: unknown, message: string): void {
  if (condition) return
  console.warn(`[vike-react-sentry][Warning] ${message}`)
}
