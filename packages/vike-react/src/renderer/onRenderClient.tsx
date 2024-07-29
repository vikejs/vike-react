// https://vike.dev/onRenderClient
export { onRenderClient }

import ReactDOM from 'react-dom/client'
import { getHeadSetting } from './getHeadSetting.js'
import type { OnRenderClientSync, PageContextClient } from 'vike/types'
import { getPageElement } from './getPageElement.js'
import type { PageContextInternal } from '../types/PageContext.js'
import './styles.css'

let root: ReactDOM.Root
const onRenderClient: OnRenderClientSync = (pageContext): ReturnType<OnRenderClientSync> => {
  // Use case:
  // - Store hydration https://github.com/vikejs/vike-react/issues/110
  pageContext.config.onBeforeRenderClient?.(pageContext)

  const page = getPageElement(pageContext)
  pageContext.page = page

  // TODO: implement this? So that, upon errors, onRenderClient() throws an error and Vike can render the error. As of April 2024 it isn't released yet.
  //  - https://react-dev-git-fork-rickhanlonii-rh-root-options-fbopensource.vercel.app/reference/react-dom/client/createRoot#show-a-dialog-for-uncaught-errors
  //  - https://react-dev-git-fork-rickhanlonii-rh-root-options-fbopensource.vercel.app/reference/react-dom/client/hydrateRoot#show-a-dialog-for-uncaught-errors
  const onUncaughtError = (_error: any, _errorInfo: any) => {}

  const container = document.getElementById('root')!
  if (
    pageContext.isHydration &&
    // Whether the page was [Server-Side Rendered](https://vike.dev/ssr).
    container.innerHTML !== ''
  ) {
    // First render while using SSR, i.e. [hydration](https://vike.dev/hydration)
    root = ReactDOM.hydrateRoot(container, page, {
      // @ts-expect-error
      onUncaughtError
    })
  } else {
    if (!root) {
      // First render without SSR
      root = ReactDOM.createRoot(container, {
        // @ts-expect-error
        onUncaughtError
      })
    }
    root.render(page)
  }
  pageContext.root = root

  if (!pageContext.isHydration) {
    // E.g. document.title
    updateDocument(pageContext)
  }

  // Use cases:
  // - User-land document settings (e.g. user-land implementation of `config.favicon`)
  // - Testing tools https://github.com/vikejs/vike-react/issues/95
  pageContext.config.onAfterRenderClient?.(pageContext)
}

function updateDocument(pageContext: PageContextClient) {
  ;(pageContext as PageContextInternal)._headAlreadySet = true

  const title = getHeadSetting('title', pageContext)
  const lang = getHeadSetting('lang', pageContext)
  const favicon = getHeadSetting('favicon', pageContext)

  // - We skip if `undefined` as we shouldn't remove values set by the Head setting.
  // - Setting a default prevents the previous value to be leaked: upon client-side navigation, the value set by the previous page won't be removed if the next page doesn't override it.
  //   - Most of the time, the user sets a default himself (i.e. a value defined at /pages/+config.js)
  if (title !== undefined) document.title = title || ''
  if (lang !== undefined) document.documentElement.lang = lang || 'en'
  if (favicon !== undefined) setFavicon(favicon)
}

// TODO/next-major-release: remove config.favicon and, instead, add docs showcasing how to implement a favicon setting on the user-land.
// https://stackoverflow.com/questions/260857/changing-website-favicon-dynamically/260876#260876
function setFavicon(faviconUrl: string | null) {
  let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']")
  if (!faviconUrl) {
    if (link) document.head.removeChild(link)
    return
  }
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.href = faviconUrl
}
