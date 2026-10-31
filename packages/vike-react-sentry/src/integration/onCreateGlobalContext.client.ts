export { onCreateGlobalContext }

import * as SentryReact from '@sentry/react'
import type { GlobalContextClient } from 'vike/types'
import { resolveSentryOptions } from './sentryOptions.js'

async function onCreateGlobalContext(globalContext: GlobalContextClient): Promise<void> {
  // Vike calls it again upon HMR
  if (SentryReact.getClient()) return
  const options = await resolveSentryOptions<SentryReact.BrowserOptions>(globalContext)
  // Sentry throws upon creating a second Replay instance
  const hasReplay =
    Array.isArray(options.integrations) && options.integrations.some((integration) => integration.name === 'Replay')
  SentryReact.init({
    // The user's `integrations` are added to these
    defaultIntegrations: [
      ...SentryReact.getDefaultIntegrations(options),
      SentryReact.browserTracingIntegration(),
      ...(hasReplay ? [] : [SentryReact.replayIntegration()]),
    ],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    ...options,
  })
}
