// https://vike.dev/onRenderClient
export { onRenderClient }

import ReactDOM, { type RootOptions } from 'react-dom/client'
import { getHeadSetting } from './getHeadSetting.js'
import type { OnRenderClientAsync, PageContextClient } from 'vike/types'
import { getPageElement } from './getPageElement.js'
import type { PageContextInternal } from '../types/PageContext.js'
import { callCumulativeHooks } from '../utils/callCumulativeHooks.js'
import { applyHeadSettings } from './applyHeadSettings.js'
import { resolveReactOptions } from './resolveReactOptions.js'
import { getGlobalObject } from '../utils/getGlobalObject.js'
import { isObject } from '../utils/isObject.js'

const globalObject = getGlobalObject<{
  root?: ReactDOM.Root
  onUncaughtErrorLocal?: (err: unknown) => void
}>('onRenderClient.tsx', {})

const onRenderClient: OnRenderClientAsync = async (
  pageContext: PageContextClient & PageContextInternal,
): ReturnType<OnRenderClientAsync> => {
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
  logUncaughtError(args)
  const [error] = args
  globalObject.onUncaughtErrorLocal?.(error)
  userOptions?.onUncaughtError?.apply(this, args)
}
type OnUncaughtError = RootOptions['onUncaughtError']
type OnUncaughtErrorArgs = Parameters<NonNullable<RootOptions['onUncaughtError']>>

async function logUncaughtError(args: OnUncaughtErrorArgs) {
  const [error, errorInfo] = args
  console.error('%o\n%s', error, `The above error occurred at:${errorInfo.componentStack}`)
  // Used by Vike:
  // https://github.com/vikejs/vike/blob/8ce2cbda756892f0ff083256291515b5a45fe319/packages/vike/client/runtime-client-routing/renderPageClientSide.ts#L838-L844
  if (isObject(error)) error.isAlreadyLogged = true
}
