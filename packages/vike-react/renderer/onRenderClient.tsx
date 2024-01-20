// https://vike.dev/onRenderClient
export { onRenderClient }

import ReactDOM from 'react-dom/client'
import { getHeadSetting } from './getHeadSetting.js'
import type { OnRenderClientSync } from 'vike/types'
import { getPageElement } from './getPageElement.js'

let root: ReactDOM.Root
const onRenderClient: OnRenderClientSync = (pageContext): ReturnType<OnRenderClientSync> => {
  const page = getPageElement(pageContext)

  const container = document.getElementById('page-view')!
  if (container.innerHTML !== '' && pageContext.isHydration) {
    // First render (hydration)
    root = ReactDOM.hydrateRoot(container, page)
  } else {
    if (!root) {
      // First render (not hydration)
      root = ReactDOM.createRoot(container)
    } else {
      // Client-side navigation

      // getHeadSetting() needs to be called before any `await` so that users can use component hooks such as usePageContext() nand useData()
      const title = getHeadSetting('title', pageContext) || ''
      const lang = getHeadSetting('lang', pageContext) || 'en'
      const favicon = getHeadSetting('favicon', pageContext)
      document.title = title
      document.documentElement.lang = lang
      setFavicon(favicon)
    }

    root.render(page)
  }
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
