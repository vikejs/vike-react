export { onCreateGlobalContext }

import * as SentryNode from '@sentry/node'
import type { GlobalContextServer } from 'vike/types'
import type { SentryOptions } from '../types.js'
import type { SentryNodeOptions } from '../types.js'
import { resolveDsn } from '../utils/resolveDsn.js'
import { TRACE_DEFAULT_SAMPLE_RATE } from './constants.js'

async function onCreateGlobalContext(globalContext: GlobalContextServer): Promise<void> {
  const sentryConfigs = globalContext.config.sentry || []

  const serverConfig: SentryOptions = {}
  for (const curr of [...sentryConfigs].reverse()) {
    const resolvedConfig = typeof curr === 'function' ? await curr() : curr
    Object.assign(serverConfig, resolvedConfig)
  }

  if (!SentryNode.getClient()) {
    const options = resolveSentryServerSettings(serverConfig)
    SentryNode.init({ defaultIntegrations: getDefaultIntegrations(options), ...options })
  }
}

function getDefaultIntegrations(options: SentryNodeOptions) {
  return SentryNode.getDefaultIntegrations(options).map((integration) =>
    integration.name !== 'Http'
      ? integration
      : SentryNode.httpIntegration({
          // The dev server also serves the app's modules: they aren't page requests
          ignoreIncomingRequests: (_urlPath, request) => {
            const destination = request.headers['sec-fetch-dest']
            return import.meta.env.DEV && (destination === 'script' || destination === 'style')
          },
        }),
  )
}

const resolveSentryServerSettings = (serverConfig: SentryNodeOptions): SentryNodeOptions => ({
  environment: serverConfig.environment || import.meta.env.MODE || 'production',
  dsn: resolveDsn(serverConfig.dsn),
  tracesSampleRate: serverConfig.tracesSampleRate ?? TRACE_DEFAULT_SAMPLE_RATE,
  ...serverConfig,
})
