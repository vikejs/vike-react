export { onCreateGlobalContext }

import * as SentryReact from '@sentry/react'
import type { PageContext } from 'vike/types'
import { resolveDsn } from '../utils/resolveDsn.js'
import { assignDeep } from '../utils/assignDeep.js'

async function onCreateGlobalContext(globalContext: { config: PageContext['config'] }): Promise<void> {
  if (!globalContext.config.sentry?.length) return
  const clientConfig = globalContext.config.sentry.reverse().reduce((acc, curr) => assignDeep(acc, curr), {})
  if (!clientConfig) return
  if (!SentryReact.getClient()) {
    SentryReact.init({
      integrations: [SentryReact.browserTracingIntegration()],
      ...clientConfig,
      dsn: resolveDsn(clientConfig.dsn),
    })
  }
}
