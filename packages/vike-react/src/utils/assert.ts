export function assert(condition: unknown): asserts condition {
  if (condition) return
  throw new Error('You stumbled upon a vike-react bug, reach out on GitHub.')
}

export function assertWarning(condition: unknown, message: string) {
  if (condition) return
  console.warn(new Error(message))
}
