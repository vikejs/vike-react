export { onCreateGlobalContext }

import * as SentryNode from '@sentry/node'
import type { PageContext } from 'vike/types'
import { resolveDsn } from '../utils/resolveDsn.js'
import { assignDeep } from '../utils/assignDeep.js'

async function onCreateGlobalContext(globalContext: { config: PageContext['config'] }): Promise<void> {
  if (!globalContext.config.sentry?.length) return
  const serverConfig = globalContext.config.sentry.reverse().reduce((acc, curr) => assignDeep(acc, curr), {})
  if (!serverConfig) return
  if (!SentryNode.getClient()) {
    SentryNode.init({
      ...serverConfig,
      dsn: resolveDsn(serverConfig.dsn),
    })
  }
}
