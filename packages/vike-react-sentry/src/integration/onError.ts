export { onError }

import * as SentryNode from '@sentry/node'
import type { Config } from 'vike/types'
import { captureHookError, recallHook } from './hookErrors.js'

// Vike calls it once per server error, after skipping redirect(), render() and abort()
const onError: Config['onError'] = (error, pageContext) => {
  if (!SentryNode.isEnabled()) return
  captureHookError(SentryNode, error, recallHook(error), pageContext)
}
