export { onCreateGlobalContext }

import * as SentryReact from '@sentry/react'
import type { PageContext } from 'vike/types'

async function onCreateGlobalContext(globalContext: { config: PageContext['config'] }): Promise<void> {
  const sentryConfig = globalContext.config.sentry
  if (!sentryConfig) return
  if (sentryConfig.client && !SentryReact.getClient()) {
    const { client, vitePlugin, server, ...commonOptions } = sentryConfig

    const finalConfig = {
      ...commonOptions,
      integrations: [SentryReact.browserTracingIntegration()],
      ...client,
    }

    SentryReact.init(finalConfig)
  }
}
