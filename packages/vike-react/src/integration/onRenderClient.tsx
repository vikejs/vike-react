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

const globalObject = getGlobalObject<{
  root?: ReactDOM.Root
  onUncaughtError?: RootOptions['onUncaughtError']
}>('onRenderClient.tsx', {})

const onRenderClient: OnRenderClientAsync = async (
  pageContext: PageContextClient & PageContextInternal,
): ReturnType<OnRenderClientAsync> => {
  console.log('onRenderClient()')
  pageContext._headAlreadySet = pageContext.isHydration

  // Use case:
  // - Store hydration https://github.com/vikejs/vike-react/issues/110
  await callCumulativeHooks(pageContext.config.onBeforeRenderClient, pageContext)

  const { page, renderPromise, renderPromiseReject } = getPageElement(pageContext)
  pageContext.page = page

  // Local callback for current page
  globalObject.onUncaughtError = (error, errorInfo) => {
    console.log('reject')
    renderPromiseReject(error)
  }
  // Global callback, attached once at hydration
  const onUncaughtError: RootOptions['onUncaughtError'] = (error, errorInfo) => {
    console.log('error', error)
    console.log('errorInfo', errorInfo)
    globalObject.onUncaughtError?.(error, errorInfo)
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
      onUncaughtError(error, errorInfo) {
        onUncaughtError(error, errorInfo)
        hydrateRootOptions?.onUncaughtError?.(error, errorInfo)
      },
    })
  } else {
    if (!globalObject.root) {
      // First render without SSR
      globalObject.root = ReactDOM.createRoot(container, {
        ...createRootOptions,
        onUncaughtError(error, errorInfo) {
          onUncaughtError(error, errorInfo)
          createRootOptions?.onUncaughtError?.(error, errorInfo)
        },
      })
    }
    globalObject.root.render(page)
  }
  pageContext.root = globalObject.root

  console.log('renderPromise before')
  try {
    await renderPromise
  } catch (err) {
    console.log('renderPromise err', err)
  }
  console.log('renderPromise after')

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
