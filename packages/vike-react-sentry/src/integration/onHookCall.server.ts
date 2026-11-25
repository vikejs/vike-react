export { onHookCall }

import * as SentryNode from '@sentry/node'
import type { Config } from 'vike/types'
import { captureHookError } from './hookErrors.js'
import { traceHook } from './traceHook.js'

const onHookCall: Config['onHookCall'] = (hook, pageContext) =>
  traceHook(SentryNode, hook, pageContext, (error) => {
    // Sentry can't mark a thrown string (or other primitive) as sent, so +onError sends it
    if (typeof error !== 'object' || error === null) return
    captureHookError(SentryNode, error, hook, pageContext)
  })
