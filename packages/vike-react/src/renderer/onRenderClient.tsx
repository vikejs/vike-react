// https://vike.dev/onRenderClient
export { onRenderClient }

import ReactDOM from 'react-dom/client'
import { getHeadSetting } from './getHeadSetting.js'
import type { OnRenderClientSync } from 'vike/types'
import { getPageElement } from './getPageElement.js'
import { applyDocumentClientSide } from './applyDocumentClientSide.js'

let root: ReactDOM.Root
const onRenderClient: OnRenderClientSync = (pageContext): ReturnType<OnRenderClientSync> => {
  const page = getPageElement(pageContext)

  // TODO: implement this? So that, upon errors, onRenderClient() throws an error and Vike can render the error. As of April 2024 it isn't released yet.
  //  - https://react-dev-git-fork-rickhanlonii-rh-root-options-fbopensource.vercel.app/reference/react-dom/client/createRoot#show-a-dialog-for-uncaught-errors
  //  - https://react-dev-git-fork-rickhanlonii-rh-root-options-fbopensource.vercel.app/reference/react-dom/client/hydrateRoot#show-a-dialog-for-uncaught-errors
  const onUncaughtError = (_error: any, _errorInfo: any) => {}

  const container = document.getElementById('react-root')!
  if (container.innerHTML !== '' && pageContext.isHydration) {
    // First render (hydration)
    root = ReactDOM.hydrateRoot(container, page, {
      // @ts-expect-error
      onUncaughtError
    })
  } else {
    if (!root) {
      // First render (not hydration)
      root = ReactDOM.createRoot(container, {
        // @ts-expect-error
        onUncaughtError
      })
    } else {
      // Client-side navigation

      const title = getHeadSetting('title', pageContext) || ''
      const lang = getHeadSetting('lang', pageContext) || 'en'
      const favicon = getHeadSetting('favicon', pageContext)

      // We skip if the value is undefined because we shouldn't remove values set in HTML (by the Head setting).
      //  - This also means that previous values will leak: upon client-side navigation, the title set by the previous page won't be removed if the next page doesn't override it. But that's okay because usually pages always have a favicon and title, which means that previous values are always overriden. Also, as a workaround, the user can set the value to `null` to ensure that previous values are overriden.
      if (title !== undefined) document.title = title
      if (lang !== undefined) document.documentElement.lang = lang
      if (favicon !== undefined) setFavicon(favicon)

      applyDocumentClientSide(pageContext)
    }

    root.render(page)
  }

  pageContext.page = page
  pageContext.root = root
  pageContext.config.onAfterRenderClient?.(pageContext)
}

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
