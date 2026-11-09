export { react }

import * as SentryReact from '@sentry/react'
import type { Config } from 'vike/types'
import { isVikeControlFlow } from '../utils/isVikeControlFlow.js'
import { isShownPageAbortError, setShownPage } from './shownPage.js'

// These callbacks replace React's defaults, which log the error. (vike-react logs uncaught errors itself, and React's
// default for recoverable errors, window.reportError(), would make Sentry's global handler send them a second time.)
const logError = (error: unknown) => console.error(error)

// After hydration, React reports render errors only to the root's callbacks
const rootOptions = {
  onUncaughtError: rootErrorHandler(),
  onCaughtError: rootErrorHandler(logError),
  onRecoverableError: rootErrorHandler(logError),
}

const react: Config['react'] = (pageContext) => {
  // vike-react calls it on every render, right before giving React the page
  setShownPage(pageContext)
  return {
    hydrateRootOptions: rootOptions,
    createRootOptions: rootOptions,
  }
}

function rootErrorHandler(log?: (error: unknown) => void): ReturnType<typeof SentryReact.reactErrorHandler> {
  const sendError = SentryReact.reactErrorHandler(log)
  return (error, errorInfo) => {
    // Vike handles the redirect() or render() a component throws, and aborts the fetch() of the page the user leaves
    if (isVikeControlFlow(error) || isShownPageAbortError(error)) log?.(error)
    else sendError(error, errorInfo)
  }
}
