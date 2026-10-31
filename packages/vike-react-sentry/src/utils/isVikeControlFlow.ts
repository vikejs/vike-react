export { isVikeControlFlow }

/** Whether `thing` was thrown by `throw redirect()`, `throw render()` or `throw abort()`. */
function isVikeControlFlow(thing: unknown): boolean {
  // vike/abort exports no predicate: this is the stamp Vike sets on every abort
  return typeof thing === 'object' && thing !== null && '_isAbortError' in thing
}
