import * as Sentry from '@sentry/node'
import { markErrorAsCaptured } from '../utils/error.js'
import type { Config, PageContextServer } from 'vike/types'
type Hook = Parameters<Extract<Config['onHookCall'], Function>>[0]

/**
 * Vike onHookCall configuration for Sentry integration (server-side).
 * Provides automatic tracing and error capture for all Vike hooks.
 */
export async function onHookCall(hook: Hook, pageContext: PageContextServer) {
  if (!Sentry.getClient() || hook.name === 'onError') {
    return hook.call()
  }

  // Extract useful context for Sentry
  const url = pageContext?.urlOriginal ?? 'unknown'
  const pageId = pageContext?.pageId ?? 'unknown'

  // withScope ensures any error captured during hook execution has Vike context
  return Sentry.withScope((scope) => {
    scope.setTag('vike.hook', hook.name)
    scope.setTag('vike.page', pageId)
    scope.setContext('vike', {
      hook: hook.name,
      filePath: hook.filePath,
      pageId,
      url,
    })

    return Sentry.startSpan(
      {
        name: hook.name,
        op: 'vike.hook',
        attributes: {
          'vike.hook.name': hook.name,
          'vike.hook.file': hook.filePath,
          'vike.page.id': pageId,
          'vike.url': url,
        },
      },
      async (span) => {
        try {
          await hook.call()
        } catch (error) {
          span.setStatus({
            code: 2,
          })
          Sentry.captureException(error)
          markErrorAsCaptured(error)
        }
      },
    )
  })
}
