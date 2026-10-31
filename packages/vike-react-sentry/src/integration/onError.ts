export { onError }

import * as SentryNode from '@sentry/node'
import type { Config } from 'vike/types'
import { captureHookError, recallHook } from './hookErrors.js'

// Vike calls it once per server error, after skipping redirect(), render() and abort()
const onError: Config['onError'] = (error, pageContext) => {
  if (!SentryNode.isEnabled()) return
  captureHookError(SentryNode, getOriginalError(error), recallHook(error), pageContext)
}

// In development, Vike (>= 0.4.268) prepends its log line to the error's message and stack before calling +onError,
// and keeps a copy of the error from before
function getOriginalError(error: unknown): unknown {
  const getOriginal = (error as { getOriginalError?: unknown } | null)?.getOriginalError
  return typeof getOriginal === 'function' ? getOriginal() : error
}
