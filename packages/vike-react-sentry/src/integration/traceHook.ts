export { traceHook }

import type * as SentryReact from '@sentry/react'
import type { Config, PageContext } from 'vike/types'
import { isVikeControlFlow } from '../utils/isVikeControlFlow.js'

type Sentry = Pick<typeof SentryReact, 'isEnabled' | 'withScope' | 'startSpan' | 'captureException'>
type Hook = Parameters<Extract<Config['onHookCall'], Function>>[0]

/** Traces a Vike hook call and captures its error. */
async function traceHook(Sentry: Sentry, hook: Hook, pageContext: PageContext | null) {
  if (
    !Sentry.isEnabled() ||
    hook.name === 'onError' ||
    // +route functions run for every link Vike prefetches
    hook.name === 'route' ||
    // Set by Vike while prefetching a link (vike > 0.4.268)
    (pageContext as { isPrefetch?: boolean } | null)?.isPrefetch
  ) {
    // Vike keeps the hook's result and error, and (vike <= 0.4.268) logs whatever +onHookCall rejects with
    hook.call()
    return
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
        // Hooks running outside a page view (e.g. prefetching) would each become a transaction
        onlyIfParent: true,
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
          if (isVikeControlFlow(error)) return
          span.setStatus({ code: 2, message: 'internal_error' })
          Sentry.captureException(error)
        }
      },
    )
  })
}
