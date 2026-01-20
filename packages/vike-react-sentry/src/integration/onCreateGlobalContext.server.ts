export { onCreateGlobalContext }

import * as SentryNode from '@sentry/node'
import type { GlobalContextServer } from 'vike/types'
import { SentryOptions } from '../types.js'
import { assignDeep } from '../utils/assignDeep.js'
import { DEFAULT_SENTRY_SERVER_SETTINGS } from './defaults-server.js'

async function onCreateGlobalContext(globalContext: GlobalContextServer): Promise<void> {
  const serverConfig = (globalContext.config.sentry || []).reverse().reduce((acc, curr) => {
    if (typeof curr === 'function') {
      curr = curr(globalContext)
    }
    return assignDeep(acc, curr)
  }, {}) as SentryOptions

  if (!SentryNode.getClient()) {
    SentryNode.init({
      ...DEFAULT_SENTRY_SERVER_SETTINGS(serverConfig),
      ...serverConfig,
    })
  }
}
