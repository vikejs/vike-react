export { onCreateGlobalContext }

import * as SentryReact from '@sentry/react'
import type { GlobalContextClient } from 'vike/types'
import { resolveDsn } from '../utils/resolveDsn.js'
import { assignDeep } from '../utils/assignDeep.js'
import { SentryOptions } from '../types.js'

async function onCreateGlobalContext(globalContext: GlobalContextClient): Promise<void> {
  if (!globalContext.config.sentry?.length) return
  const clientConfig = globalContext.config.sentry.reverse().reduce((acc, curr) => {
    if (typeof curr === 'function') {
      curr = curr(globalContext)
    }
    return assignDeep(acc, curr)
  }, {}) as SentryOptions

  if (!clientConfig) return
  if (!SentryReact.getClient()) {
    SentryReact.init({
      integrations: [SentryReact.browserTracingIntegration()],
      ...clientConfig,
      dsn: resolveDsn(clientConfig.dsn),
    })
  }
}
