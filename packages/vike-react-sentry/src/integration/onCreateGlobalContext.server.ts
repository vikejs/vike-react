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
            // The dev server also serves the app's modules and assets. Browsers send `sec-fetch-dest`: `document`,
            // `iframe` or `frame` for a page view, `empty` for fetch() and XHR (e.g. pageContext.json), and any other
            // value for a subresource (script, style, image, font, worker, manifest, ...), which isn't traced in dev.
            ignoreIncomingRequests: (_urlPath, request) => {
              const destination = request.headers['sec-fetch-dest']
              return (
                import.meta.env.DEV &&
                typeof destination === 'string' &&
                !['document', 'iframe', 'frame', 'empty'].includes(destination)
              )
            },
          }),
    ),
    ...options,
  })
}
