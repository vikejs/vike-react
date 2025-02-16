// https://vike.dev/onRenderClient
export { onRenderClient }

import ReactDOM from 'react-dom/client'
import { getHeadSetting } from './getHeadSetting.js'
import type { OnRenderClientAsync, PageContextClient } from 'vike/types'
import { getPageElement } from './getPageElement.js'
import type { PageContextInternal } from '../types/PageContext.js'
import './styles.css'
import { callCumulativeHooks } from '../utils/callCumulativeHooks.js'
import { applyHeadSettings } from './applyHeadSettings.js'
import { isCallable } from '../utils/isCallable.js'
import { objectEntries } from '../utils/objectEntries.js'

let root: ReactDOM.Root
const onRenderClient: OnRenderClientAsync = async (
  pageContext: PageContextClient & PageContextInternal,
): ReturnType<OnRenderClientAsync> => {
  pageContext._headAlreadySet = pageContext.isHydration

  // Use case:
  // - Store hydration https://github.com/vikejs/vike-react/issues/110
  await callCumulativeHooks(pageContext.config.onBeforeRenderClient, pageContext)

  const { page, renderPromise } = getPageElement(pageContext)
  pageContext.page = page

  // TODO: implement this? So that, upon errors, onRenderClient() throws an error and Vike can render the error page. As of April 2024 it isn't released yet.
  //  - https://react-dev-git-fork-rickhanlonii-rh-root-options-fbopensource.vercel.app/reference/react-dom/client/createRoot#show-a-dialog-for-uncaught-errors
  //  - https://react-dev-git-fork-rickhanlonii-rh-root-options-fbopensource.vercel.app/reference/react-dom/client/hydrateRoot#show-a-dialog-for-uncaught-errors
  const onUncaughtError = (_error: any, _errorInfo: any) => {}

  const container = document.getElementById('root')!
  const { hydrateRootOptions, createRootOptions } = await resolveCumulativeOptions(
    pageContext.config.react,
    pageContext,
  )
  if (
    pageContext.isHydration &&
    // Whether the page was [Server-Side Rendered](https://vike.dev/ssr).
    container.innerHTML !== ''
  ) {
    // First render while using SSR, i.e. [hydration](https://vike.dev/hydration)
    root = ReactDOM.hydrateRoot(container, page, hydrateRootOptions)
  } else {
    if (!root) {
      // First render without SSR
      root = ReactDOM.createRoot(container, createRootOptions)
    }
    root.render(page)
  }
  pageContext.root = root

  await renderPromise

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

async function resolveCumulativeOptions<Options extends Partial<Record<string, unknown>>>(
  optionList: (Options | undefined | ((pageContext: PageContextClient) => Options | undefined))[] | undefined,
  pageContext: PageContextClient,
): Promise<Options> {
  const optionsAcc: Options = {} as Options
  await Promise.all(
    (optionList ?? []).map(async (valUnresolved) => {
      const options: Options | undefined = isCallable(valUnresolved) ? valUnresolved(pageContext) : valUnresolved
      if (!options) return
      objectEntries(options).forEach(([key, val]) => {
        if (!isCallable(val)) {
          options![key] ??= val
        } else {
          ;(options![key] as Function | undefined) = (...args: unknown[]) => {
            ;(options![key] as Function | undefined)?.(...args)
            val(...args)
          }
        }
      })
    }),
  )
  return optionsAcc
}
