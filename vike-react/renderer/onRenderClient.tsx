export default onRenderClient

import ReactDOM from 'react-dom/client'
import { getTitle } from './getTitle.js'
import type { PageContextClient } from './types'
import { getPageElement } from './getPageElement.js'

let root: ReactDOM.Root
async function onRenderClient(pageContext: PageContextClient) {
  const page = getPageElement(pageContext)

  const container = document.getElementById('page-view')!
  if (container.innerHTML !== '' && pageContext.isHydration) {
    root = ReactDOM.hydrateRoot(container, page)
  } else {
    if (!root) {
      root = ReactDOM.createRoot(container)
    }
    root.render(page)
  }
  const title = getTitle(pageContext)
  if (title !== null) {
    document.title = title
  }
}
