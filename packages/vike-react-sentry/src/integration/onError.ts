export { onError }

import * as SentryNode from '@sentry/node'
import type { Config } from 'vike/types'
import { captureHookError } from './hookErrors.js'

// Vike calls it once per server error, after skipping redirect(), render() and abort(); Sentry drops those already sent
const onError: Config['onError'] = (error, pageContext) => {
  if (!SentryNode.isEnabled()) return
  captureHookError(SentryNode, error, undefined, pageContext)
}
