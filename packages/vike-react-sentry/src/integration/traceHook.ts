export { traceHook }

import type * as SentryReact from '@sentry/react'
import type { Config, PageContext } from 'vike/types'

type Sentry = Pick<typeof SentryReact, 'isEnabled' | 'withScope' | 'startSpan' | 'captureException'>
type Hook = Parameters<Extract<Config['onHookCall'], Function>>[0]

/** Traces a Vike hook call and captures its error. */
async function traceHook(Sentry: Sentry, hook: Hook, pageContext: PageContext | null) {
  if (!Sentry.isEnabled() || hook.name === 'onError') {
    return hook.call()
  }

  // Extract useful context for Sentry
  const url = pageContext?.urlOriginal ?? 'NOT-DEFINED'
  const pageId = pageContext?.pageId ?? 'NOT-DEFINED'

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
        }
      },
    )
  })
}
