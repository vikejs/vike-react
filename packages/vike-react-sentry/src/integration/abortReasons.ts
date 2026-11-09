export { watchAbortSignal }
export { isAbortReason }

import type { PageContext } from 'vike/types'

// What a fetch(url, { signal: pageContext.abortSignal }) rejects with once Vike fires the signal
const abortReasons = new WeakSet<object>()

/** Remembers the reason of `pageContext.abortSignal` once Vike fires it (vike >= 0.4.269). */
function watchAbortSignal(pageContext: PageContext | null) {
  const abortSignal = (pageContext as { abortSignal?: AbortSignal } | null)?.abortSignal
  // Adding the same listener again is a no-op
  abortSignal?.addEventListener('abort', rememberAbortReason)
}

function rememberAbortReason(event: Event) {
  // Vike calls abort() without a reason, so the reason is a DOMException
  abortReasons.add((event.target as AbortSignal).reason)
}

/** Whether `thing` is the reason of a `pageContext.abortSignal` that Vike fired. */
function isAbortReason(thing: unknown): boolean {
  return typeof thing === 'object' && thing !== null && abortReasons.has(thing)
}
