export { isAbortSignalError }

/** Whether `thing` was thrown because `abortSignal` fired, e.g. by `fetch(url, { signal: pageContext.abortSignal })`. */
function isAbortSignalError(thing: unknown, abortSignal: AbortSignal | undefined): boolean {
  // Vike's rule for the errors it doesn't log
  if (!abortSignal?.aborted) return false
  return (
    thing === abortSignal.reason ||
    (typeof thing === 'object' && thing !== null && 'name' in thing && thing.name === 'AbortError')
  )
}
