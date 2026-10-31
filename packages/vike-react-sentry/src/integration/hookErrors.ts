export { rememberHook }
export { recallThrow }
export { captureHookError }
export { getHookScope }
export type { Hook }

import type * as SentryReact from '@sentry/react'
import type { Config, PageContext } from 'vike/types'

type Hook = Parameters<Extract<Config['onHookCall'], Function>>[0]

// Vike's +onError doesn't say which hook threw, and by then Vike's logger may have changed the error's message (its
// log line, a hint) and stack (also Vite's source maps, in development)
const thrownErrors = new WeakMap<object, { hook: Hook; message: string | undefined }>()

function rememberHook(error: unknown, hook: Hook): void {
  if (typeof error !== 'object' || error === null) return
  thrownErrors.set(error, { hook, message: isError(error) ? error.message : undefined })
}

/**
 * What the hook threw, as it threw it, and the hook. For an Error: the message it was thrown with and its current
 * stack frames. For anything else: the copy Vike (>= 0.4.268, in development) keeps from before it changed the value
 * (it adds a message and stack to a thrown object, and wraps a thrown string in an Error of its own), else the value.
 */
function recallThrow(error: unknown): { error: unknown; hook?: Hook } {
  const thrown = typeof error === 'object' && error !== null ? thrownErrors.get(error) : undefined
  if (!isError(error) || thrown?.message === undefined) {
    const getOriginalError = (error as { getOriginalError?: unknown } | null)?.getOriginalError
    const original: unknown = typeof getOriginalError === 'function' ? getOriginalError() : error
    // Vike's copy of an Error loses its stack, an accessor
    const isCopyOfError = isError(error) && typeof original === 'object' && original !== null
    return { error: isCopyOfError ? error : original, hook: thrown?.hook }
  }
  const frames = (error.stack ?? '').split('\n').filter((line) => /^\s+at /.test(line))
  // Sentry tells a copy is an error by `instanceof Error`, which an error from another realm fails
  const prototype = error instanceof Error ? Object.getPrototypeOf(error) : Error.prototype
  // One descriptor map: an own field of the error can be non-configurable (e.g. a `name` set with defineProperty())
  const errorAsThrown: Error = Object.create(prototype, {
    ...Object.getOwnPropertyDescriptors(error),
    name: { value: error.name, writable: true, configurable: true },
    message: { value: thrown.message, writable: true, configurable: true },
    stack: { value: [`${error.name}: ${thrown.message}`, ...frames].join('\n'), writable: true, configurable: true },
  })
  return { error: errorAsThrown, hook: thrown.hook }
}

function captureHookError(
  Sentry: Pick<typeof SentryReact, 'captureException'>,
  error: unknown,
  hook?: Hook,
  pageContext?: PageContext | null,
): void {
  Sentry.captureException(error, {
    mechanism: { type: 'auto.function.vike', handled: false },
    captureContext: getHookScope(hook, pageContext),
  })
}

function getHookScope(
  hook?: Hook,
  pageContext?: PageContext | null,
): { tags: Record<string, string | undefined>; contexts: Record<string, Record<string, unknown>> } {
  return {
    tags: { 'vike.hook': hook?.name, 'vike.page': pageContext?.pageId ?? undefined },
    contexts: {
      vike: {
        hook: hook?.name,
        filePath: hook?.filePath,
        pageId: pageContext?.pageId,
        urlPathname: pageContext?.urlPathname,
      },
    },
  }
}

// As Sentry tells errors: `instanceof Error` is false for an error from another realm (e.g. node:vm)
function isError(value: unknown): value is Error {
  const tag = Object.prototype.toString.call(value)
  return (
    value instanceof Error ||
    tag === '[object Error]' ||
    tag === '[object Exception]' ||
    tag === '[object DOMException]'
  )
}
