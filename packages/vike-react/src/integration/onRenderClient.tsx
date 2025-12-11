// https://vike.dev/onRenderClient
export { onRenderClient }

import ReactDOM, { type RootOptions } from 'react-dom/client'
import { getHeadSetting } from './getHeadSetting.js'
import type { PageContextClient } from 'vike/types'
import { getPageElement } from './getPageElement.js'
import type { PageContextInternal } from '../types/PageContext.js'
import { callCumulativeHooks } from '../utils/callCumulativeHooks.js'
import { applyHeadSettings } from './applyHeadSettings.js'
import { resolveReactOptions } from './resolveReactOptions.js'
import { getGlobalObject } from '../utils/getGlobalObject.js'
import { isObject } from '../utils/isObject.js'
import { getBetterErrorLight } from '../utils/getBetterErrorLight.js'

const globalObject = getGlobalObject<{
  root?: ReactDOM.Root
  onUncaughtErrorLocal?: (err: unknown) => void
}>('onRenderClient.tsx', {})

async function onRenderClient(pageContext: PageContextClient & PageContextInternal) {
  pageContext._headAlreadySet = pageContext.isHydration

  // Use case:
  // - Store hydration https://github.com/vikejs/vike-react/issues/110
  await callCumulativeHooks(pageContext.config.onBeforeRenderClient, pageContext)

  const { page, renderPromise, renderPromiseReject } = getPageElement(pageContext)
  pageContext.page = page

  // Local callback for current page
  globalObject.onUncaughtErrorLocal = (err: unknown) => {
    renderPromiseReject(err)
  }

  const container = document.getElementById('root')!
  const { hydrateRootOptions, createRootOptions } = resolveReactOptions(pageContext)
  if (
    pageContext.isHydration &&
    // Whether the page was [Server-Side Rendered](https://vike.dev/ssr).
    container.innerHTML !== ''
  ) {
    // First render while using SSR, i.e. [hydration](https://vike.dev/hydration)
    globalObject.root = ReactDOM.hydrateRoot(container, page, {
      ...hydrateRootOptions,
      // onUncaughtError is the right callback: https://gist.github.com/brillout/b9516e83a7a4517f4dbd0ef50e9dd716
      onUncaughtError(...args) {
        onUncaughtErrorGlobal.call(this, args, hydrateRootOptions)
      },
    })
  } else {
    if (!globalObject.root) {
      // First render without SSR
      globalObject.root = ReactDOM.createRoot(container, {
        ...createRootOptions,
        onUncaughtError(...args) {
          onUncaughtErrorGlobal.call(this, args, createRootOptions)
        },
      })
    }
    globalObject.root.render(page)
  }
  pageContext.root = globalObject.root

  try {
    await renderPromise
  } finally {
    delete globalObject.onUncaughtErrorLocal
  }

  if (!pageContext.isHydration) {
    pageContext._headAlreadySet = true
    applyHead(pageContext)
  }

  // Use cases:
  // - Custom user settings: https://vike.dev/head-tags#custom-settings
  // - Testing tools: https://github.com/vikejs/vike-react/issues/95
  await callCumulativeHooks(pageContext.config.onAfterRenderClient, pageContext)
}

function applyHead(pageContext: PageContextClient) {
  const title = getHeadSetting<string | null>('title', pageContext)
  const lang = getHeadSetting<string | null>('lang', pageContext)
  applyHeadSettings(title, lang)
}

// Global callback, attached once upon hydration.
function onUncaughtErrorGlobal(
  this: unknown,
  args: OnUncaughtErrorArgs,
  userOptions: { onUncaughtError?: OnUncaughtError } | undefined,
) {
  const [errorOriginal, errorInfo] = args
  const errorEnhanced = getErrorWithComponentStack(errorOriginal, errorInfo)
  console.error(errorEnhanced)
  // Used by Vike:
  // https://github.com/vikejs/vike/blob/8ce2cbda756892f0ff083256291515b5a45fe319/packages/vike/client/runtime-client-routing/renderPageClientSide.ts#L838-L844
  if (isObject(errorEnhanced)) errorEnhanced.isAlreadyLogged = true
  globalObject.onUncaughtErrorLocal?.(errorEnhanced)
  userOptions?.onUncaughtError?.call(this, errorEnhanced, errorInfo)
}
type OnUncaughtError = RootOptions['onUncaughtError']
type OnUncaughtErrorArgs = Parameters<NonNullable<RootOptions['onUncaughtError']>>

// Inject componentStack to the error's stack trace
type ErrorInfo = { componentStack?: string }
function getErrorWithComponentStack(errorOriginal: unknown, errorInfo?: ErrorInfo) {
  if (!errorInfo?.componentStack || !isObject(errorOriginal)) return errorOriginal
  const errorStackLines = String(errorOriginal.stack).split('\n')

  // Inject the component stack right before the React stack trace (potentially *after* some vike-react or react-streaming strack trace, e.g. if react-streaming's useAsync() throws an error).
  // Perfect cutoff (as of react@19.2.0), but can easily break upon React internal refactoring
  let cutoff = errorStackLines.findIndex((l) => l.includes('react_stack_bottom_frame'))
  if (cutoff === -1) {
    // Ideally, we should inject the component stack right before the React stack trace, and *after* any vike-react or react-streaming strack trace.
    // But we cannot (easily) do that on the client-side, because Vite pre-bundles React, vike-react, and react-streaming inside a single bundle:
    // ```console
    // # This is React code, but it's included inside the vike-react pre-optimized bundle
    // Object.react_stack_bottom_frame (http://localhost:3000/node_modules/.vite/deps/vike-react___internal_integration_onRenderClient.js)
    //  ```
    cutoff = errorStackLines.findIndex((l) => l.includes('node_modules') && l.includes('react'))
  }
  if (cutoff === -1) return errorOriginal

  const errorStackLinesBegin = errorStackLines.slice(0, cutoff)
  const errorStackLinesEnd = errorStackLines.slice(cutoff)
  const componentStackLines = errorInfo.componentStack.split('\n').filter(Boolean)
  if (componentStackLines[0] === errorStackLinesBegin.at(-1)) componentStackLines.shift()
  const stackEnhanced = [
    //
    ...errorStackLinesBegin,
    ...componentStackLines,
    ...errorStackLinesEnd,
  ].join('\n')

  const errorBetter = getBetterErrorLight(errorOriginal, { stack: stackEnhanced })
  return errorBetter
}
