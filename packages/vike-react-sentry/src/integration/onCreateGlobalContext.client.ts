export { onCreateGlobalContext }

import * as SentryReact from '@sentry/react'
import type { GlobalContextClient } from 'vike/types'
import { resolveSentryOptions } from './sentryOptions.js'

async function onCreateGlobalContext(globalContext: GlobalContextClient): Promise<void> {
  const options = await resolveSentryOptions<SentryReact.BrowserOptions>(globalContext)
  // Vike calls it again upon HMR, and concurrently for each installed copy of vike-react-sentry (hence after the await)
  if (SentryReact.getClient()) return
  SentryReact.init({
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    ...options,
    // The user's `integrations` are added to these
    defaultIntegrations: options.defaultIntegrations ?? [
      ...SentryReact.getDefaultIntegrations(options),
      SentryReact.browserTracingIntegration(),
    ],
  })
}
