export { onCreateGlobalContext }

import * as SentryReact from '@sentry/react'
import type { GlobalContextClient } from 'vike/types'
import { assignDeep } from '../utils/assignDeep.js'
import { SentryOptions } from '../types.js'
import { DEFAULT_SENTRY_CLIENT_SETTINGS } from './defaults-client.js'

async function onCreateGlobalContext(globalContext: GlobalContextClient): Promise<void> {
  const clientConfig = (globalContext.config.sentry || []).reverse().reduce((acc, curr) => {
    if (typeof curr === 'function') {
      curr = curr(globalContext)
    }
    return assignDeep(acc, curr)
  }, {}) as SentryOptions

  if (!SentryReact.getClient()) {
    SentryReact.init({
      ...DEFAULT_SENTRY_CLIENT_SETTINGS(clientConfig),
      ...clientConfig,
    })
  }
}
