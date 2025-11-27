export { onCreateGlobalContext }

import * as SentryNode from '@sentry/node'
import * as SentryReact from '@sentry/react'
import type { ErrorEvent, EventHint } from '@sentry/react'
import type { PageContext } from 'vike/types'

async function onCreateGlobalContext(globalContext: { config: PageContext['config'] }): Promise<void> {
  const sentryConfig = globalContext.config.sentry

  if (!sentryConfig) return

  if (import.meta.env.SSR) {
    // Server-side initialization
    if (sentryConfig.server && !SentryNode.getClient()) {
      const { client, vitePlugin, server, ...commonOptions } = sentryConfig

      const finalConfig = {
        ...commonOptions,
        ...server, // User overrides (including functions!)
      }

      // This has to run before server entry is imported
      // https://docs.sentry.io/platforms/javascript/guides/node/install/esm-without-import/
      SentryNode.init(finalConfig)
    }
  } else {
    // Client-side initialization
    if (sentryConfig.client && !SentryReact.getClient()) {
      const { client, vitePlugin, server, ...commonOptions } = sentryConfig

      const finalConfig = {
        ...commonOptions,
        // Default integrations if not provided
        integrations: [SentryReact.browserTracingIntegration()],
        // Default beforeSend to filter out Sentry's own errors
        beforeSend: (event: ErrorEvent, hint: EventHint) => {
          if (
            hint.originalException &&
            typeof hint.originalException === 'object' &&
            'message' in hint.originalException
          ) {
            const message = String(hint.originalException.message).toLowerCase()
            if (
              message.includes('sentry') ||
              message.includes('ingest.us.sentry.io') ||
              (message.includes('failed to fetch') && event.request?.url?.includes('sentry.io'))
            ) {
              return null
            }
          }
          if (event.request?.url?.includes('sentry.io') || event.request?.url?.includes('ingest.us.sentry.io')) {
            return null
          }
          return event
        },
        ...client, // User overrides (including functions!)
      }

      SentryReact.init(finalConfig)
    }
  }
}
