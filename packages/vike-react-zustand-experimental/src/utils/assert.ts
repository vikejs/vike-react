export { assert, assertUsage }

function assert(condition: unknown): asserts condition {
  if (condition) return
  throw new Error(
    "You stumbled upon a bug in vike-react-zustand-experimental's source code. Reach out on GitHub and we will fix the bug.",
  )
}

function assertUsage(condition: unknown, message: string): asserts condition {
  if (condition) return
  throw new Error('Wrong usage: ' + message)
}
