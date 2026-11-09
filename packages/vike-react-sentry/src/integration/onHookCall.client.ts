export { onHookCall }

import * as SentryReact from '@sentry/react'
import type { Config } from 'vike/types'
import { captureHookError } from './hookErrors.js'
import { traceHook } from './traceHook.js'
import { setShownPage } from './shownPage.js'

const onHookCall: Config['onHookCall'] = async (hook, pageContext) => {
  // Vike has no client-side +onError
  await traceHook(SentryReact, hook, pageContext, (error) => captureHookError(SentryReact, error, hook, pageContext))
  if (hook.name === 'onRenderClient') setShownPage(pageContext)
}
