export { onCreateGlobalContext }

import * as SentryNode from '@sentry/node'
import type { PageContext } from 'vike/types'

async function onCreateGlobalContext(globalContext: { config: PageContext['config'] }): Promise<void> {
  const sentryConfig = globalContext.config.sentry
  if (!sentryConfig) return
  if (sentryConfig.server && !SentryNode.getClient()) {
    const { client, vitePlugin, server, ...commonOptions } = sentryConfig

    const finalConfig = {
      ...commonOptions,
      ...server,
    }

    SentryNode.init(finalConfig)
  }
}
