export { sentry as default }

import * as Sentry from '@sentry/react'
import type { Config } from 'vike/types'

// The tests load a page with ?integrations=<setting> to try another setting
const sentry: Config['sentry'] = getSentry(new URLSearchParams(location.search).get('integrations'))

function getSentry(setting: string | null): Sentry.BrowserOptions {
  switch (setting) {
    case 'function-adds-replay':
      return { integrations: (integrations) => [...integrations, createOwnReplay()] }
    case 'function-removes-replay':
      return { integrations: (integrations) => integrations.filter((integration) => integration.name !== 'Replay') }
    case 'array-adds-replay':
      return { integrations: [createOwnReplay()] }
    case 'own-default-integrations':
      return { defaultIntegrations: [Sentry.globalHandlersIntegration(), createOwnReplay()] }
    default:
      return { integrations: [Sentry.httpClientIntegration()] }
  }
}

function createOwnReplay() {
  const replay = Sentry.replayIntegration({ maskAllText: false })
  // Lets the tests check that Sentry uses this instance
  ;(window as any).isOwnReplay = () => Sentry.getReplay() === replay
  return replay
}
