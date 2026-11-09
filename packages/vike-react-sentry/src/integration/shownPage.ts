export { setShownPage }
export { isShownPageAbortError }

import type { PageContext } from 'vike/types'
import { isAbortSignalError } from '../utils/isAbortSignalError.js'

// Fired by Vike when the user navigates away (vike >= 0.4.269); the page stays shown until the next one renders
let shownPageAbortSignal: AbortSignal | undefined

/** Remembers the page that `+onRenderClient` rendered. */
function setShownPage(pageContext: PageContext | null) {
  shownPageAbortSignal = (pageContext as { abortSignal?: AbortSignal } | null)?.abortSignal
}

/** Whether `error` was thrown because the user navigates away from the shown page, e.g. by its aborted `fetch()`. */
function isShownPageAbortError(error: unknown): boolean {
  return isAbortSignalError(error, shownPageAbortSignal)
}
