export { assert }
export { assertWarning }

function assert(condition: unknown): asserts condition {
  if (condition) return
  throw new Error('[vike-react] You stumbled upon a bug, reach out on GitHub.')
}

function assertWarning(condition: unknown, message: string) {
  if (condition) return
  console.warn(new Error(message))
}
