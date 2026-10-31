export { traceHook }

import type * as SentryReact from '@sentry/react'
import type { PageContext } from 'vike/types'
import { getHookScope, type Hook } from './hookErrors.js'
import { isVikeControlFlow } from '../utils/isVikeControlFlow.js'

type Sentry = Pick<typeof SentryReact, 'isEnabled' | 'startSpan' | 'withScope'>
type OnHookError = (error: unknown, hook: Hook, pageContext: PageContext | null) => void

/** Traces a Vike hook call, and passes its error to `onHookError()`. */
async function traceHook(Sentry: Sentry, hook: Hook, pageContext: PageContext | null, onHookError: OnHookError) {
  if (!Sentry.isEnabled() || hook.name === 'onError') {
    // Vike keeps the hook's result and error, and (vike <= 0.4.268) logs whatever +onHookCall rejects with
    hook.call()
    return
  }

  // Events the hook sends itself (e.g. with Sentry.captureMessage()) get the hook and page tags
  await Sentry.withScope(async (scope) => {
    scope.update(getHookScope(hook, pageContext))

    // Set by Vike while prefetching a link (vike > 0.4.268)
    const isPrefetch = !!(pageContext as { isPrefetch?: boolean } | null)?.isPrefetch
    // +route functions run for every link Vike prefetches: they get no span
    if (hook.name === 'route' || isPrefetch) {
      try {
        await hook.call()
      } catch (error) {
        // Vike ignores a prefetch's error, and routes again upon navigation
        if (isPrefetch || isVikeControlFlow(error)) return
        onHookError(error, hook, pageContext)
      }
      return
    }

    await Sentry.startSpan(
      {
        name: hook.name,
        op: 'vike.hook',
        // Prefetching a link runs it outside a page view: it would become a transaction per link. Other hooks get
        // their own transaction when nothing is traced, e.g. client hooks of a navigation, which run before its span.
        onlyIfParent: hook.name === 'onBeforeRoute',
        attributes: {
          'vike.hook.name': hook.name,
          'vike.hook.file': hook.filePath,
          'vike.page.id': pageContext?.pageId ?? undefined,
          'vike.url': pageContext?.urlOriginal,
        },
      },
      async (span) => {
        try {
          await hook.call()
        } catch (error) {
          if (isVikeControlFlow(error)) return
          span.setStatus({ code: 2, message: 'internal_error' })
          onHookError(error, hook, pageContext)
        }
      },
    )
  })
}
