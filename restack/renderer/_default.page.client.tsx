export { render }
export { onPageTransitionStart }
export { onPageTransitionEnd }
export const clientRouting = true
export const hydrationCanBeAborted = true

import ReactDOM from 'react-dom/client'
import { getTitle } from './getTitle'
import type { PageContextClient } from './types'
import { getPageElement } from './getPageElement'

let root: ReactDOM.Root
async function render(pageContext: PageContextClient) {
  const page = getPageElement(pageContext)

  const container = document.getElementById('page-view')!
  if (pageContext.isHydration) {
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

function onPageTransitionStart() {
  document.querySelector('body')!.classList.add('page-is-transitioning')
}
function onPageTransitionEnd() {
  document.querySelector('body')!.classList.remove('page-is-transitioning')
}
