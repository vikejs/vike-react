// https://vike.dev/onRenderClient
export { onRenderClient }

import ReactDOM from 'react-dom/client'
import { getTitle } from './getTitle.js'
import type { OnRenderClientAsync } from 'vike/types'
import { getPageElement } from './getPageElement.js'
import { getLang } from './getLang.js'

let root: ReactDOM.Root
const onRenderClient: OnRenderClientAsync = async (pageContext): ReturnType<OnRenderClientAsync> => {
  const page = getPageElement(pageContext)

  const container = document.getElementById('page-view')!
  if (container.innerHTML !== '' && pageContext.isHydration) {
    // Hydration
    root = ReactDOM.hydrateRoot(container, page)
  } else {
    if (!root) {
      // First rendering
      root = ReactDOM.createRoot(container)
    } else {
      // Client routing
      // See https://vike.dev/server-routing-vs-client-routing

      // Get the page's `title` config value, which may be different from the
      // previous page. It can even be null, in which case we should unset the
      // document title.
      const title = getTitle(pageContext)
      const lang = getLang(pageContext) || 'en'

      document.title = title || ''
      document.documentElement.lang = lang
    }

    root.render(page)
  }
}
