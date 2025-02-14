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
import type { ReactOptions } from '../types/Config.js'
import {isCallable} from '../utils/isCallable.js'
import {objectEntries} from '../utils/objectEntries.js'

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
  const { hydrateRootOptions, createRootOptions } = await getReactOptions(pageContext)
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

async function getReactOptions(pageContext: PageContextClient): Promise<DeepRequired<ReactOptions>> {
  const values = await callCumulativeHooks(pageContext.config.react, pageContext)
  return {
    hydrateRootOptions: {
      formState: pickFirst(values.map(v => v?.hydrateRootOptions?.formState)),
      identifierPrefix: pickFirst(values.map(v => v?.hydrateRootOptions?.identifierPrefix)),
      onUncaughtError: undefined,
      onRecoverableError: undefined,
      onCaughtError: undefined,
    },
    createRootOptions: {
      identifierPrefix: pickFirst(values.map(v => v?.createRootOptions?.identifierPrefix)),
      onUncaughtError: undefined,
      onRecoverableError: undefined,
      onCaughtError: undefined,
    },
  }
}
function resolveOptions<T extends Record<string, unknown>>(optionList: T[]): T | undefined {
  const options = optionList[0]
  optionList.slice(1).forEach(opts => {
    objectEntries(opts).forEach(([key, val]) => {
      if (!isCallable(val)) {
        options![key] ??= val
      } else {
        (options![key] as Function|undefined) = (...args: unknown[]) => {
          (options![key] as Function|undefined)?.(...args)
          val(...args)
        }
      }
    })
  })
  return options
}
function pickFirst<T>(arr: T[]): T | undefined {
  return arr.filter((v) => v !== undefined)[0]
}
type DeepRequired<T> = {
  [K in keyof Required<T>]: T[K] extends Record<string, unknown> | undefined ? DeepRequired<T[K]> : (T[K])
}
