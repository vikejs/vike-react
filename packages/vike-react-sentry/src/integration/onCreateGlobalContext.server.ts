export { onCreateGlobalContext }

import * as SentryNode from '@sentry/node'
import type { GlobalContextServer } from 'vike/types'
import { resolveSentryOptions } from './sentryOptions.js'

async function onCreateGlobalContext(globalContext: GlobalContextServer): Promise<void> {
  // Vike calls it again upon HMR
  if (SentryNode.getClient()) return
  const options = await resolveSentryOptions<SentryNode.NodeOptions>(globalContext)
  SentryNode.init({
    // The user's `integrations` are added to these
    defaultIntegrations: SentryNode.getDefaultIntegrations(options).map((integration) =>
      integration.name !== 'Http'
        ? integration
        : SentryNode.httpIntegration({
            // The dev server also serves the app's modules: they aren't page requests
            ignoreIncomingRequests: (_urlPath, request) => {
              const destination = request.headers['sec-fetch-dest']
              return import.meta.env.DEV && (destination === 'script' || destination === 'style')
            },
          }),
    ),
    ...options,
  })
}
