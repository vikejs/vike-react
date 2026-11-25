export { onCreateGlobalContext }

import * as SentryReact from '@sentry/react'
import type { GlobalContextClient } from 'vike/types'
import { resolveSentryOptions } from './sentryOptions.js'

async function onCreateGlobalContext(globalContext: GlobalContextClient): Promise<void> {
  const options = await resolveSentryOptions<SentryReact.BrowserOptions>(globalContext)
  // Vike calls it again upon HMR, and concurrently for each installed copy of vike-react-sentry (hence after the await)
  if (SentryReact.getClient()) return
  // Sentry throws upon creating a second Replay instance, so ours is created only once the user's integrations are applied
  const replayPlaceholder = { name: 'Replay' }
  const userIntegrations = options.integrations
  SentryReact.init({
    // The user's `integrations` are added to these
    defaultIntegrations: [
      ...SentryReact.getDefaultIntegrations(options),
      SentryReact.browserTracingIntegration(),
      replayPlaceholder,
    ],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    ...options,
    integrations(defaultIntegrations) {
      // As Sentry merges `integrations` with the default ones
      const integrations =
        typeof userIntegrations === 'function'
          ? userIntegrations(defaultIntegrations)
          : [...defaultIntegrations, ...(userIntegrations ?? [])]
      const hasOwnReplay = integrations.some(
        (integration) => integration.name === 'Replay' && integration !== replayPlaceholder,
      )
      return integrations.flatMap((integration) => {
        if (integration !== replayPlaceholder) return [integration]
        return hasOwnReplay ? [] : [SentryReact.replayIntegration()]
      })
    },
  })
}
