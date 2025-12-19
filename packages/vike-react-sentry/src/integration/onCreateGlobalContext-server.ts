export { onCreateGlobalContext }

import * as SentryNode from '@sentry/node'
import type { GlobalContextServer } from 'vike/types'
import { resolveDsn } from '../utils/resolveDsn.js'
import { assignDeep } from '../utils/assignDeep.js'
import { SentryOptions } from '../types.js'

async function onCreateGlobalContext(globalContext: GlobalContextServer): Promise<void> {
  if (!globalContext.config.sentry?.length) return
  const serverConfig = globalContext.config.sentry.reverse().reduce((acc, curr) => {
    if (typeof curr === 'function') {
      curr = curr(globalContext)
    }
    return assignDeep(acc, curr)
  }, {}) as SentryOptions

  if (!serverConfig) return
  if (!SentryNode.getClient()) {
    SentryNode.init({
      ...serverConfig,
      dsn: resolveDsn(serverConfig.dsn),
    })
  }
}
