export { onHookCall }

import * as SentryNode from '@sentry/node'
import type { Config } from 'vike/types'
import { captureHookError } from './hookErrors.js'
import { traceHook } from './traceHook.js'

const onHookCall: Config['onHookCall'] = (hook, pageContext) =>
  traceHook(SentryNode, hook, pageContext, (error) => {
    // Sentry marks an error as sent by adding a property to it, so +onError sends those it can't add one to
    if (typeof error !== 'object' || error === null || !Object.isExtensible(error)) return
    captureHookError(SentryNode, error, hook, pageContext)
  })
