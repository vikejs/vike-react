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

    // This has to run before server entry is imported
    // https://docs.sentry.io/platforms/javascript/guides/node/install/esm-without-import/
    SentryNode.init(finalConfig)
  }
}
