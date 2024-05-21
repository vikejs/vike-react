export { applyDocumentClientSide }

import type { PageContextClient } from 'vike/types'
import { getDocumentElementsIsomoprh } from './getDocument.js'

function applyDocumentClientSide(pageContext: PageContextClient): void {
  const { title, lang, favicon } = getDocumentElementsIsomoprh(pageContext)
  // We skip if the value is undefined because we shouldn't remove values set in HTML (by the Head setting).
  if (title !== undefined) window.document.title = title
  if (lang !== undefined) window.document.documentElement.lang = lang
  if (favicon !== undefined) setFavicon(favicon)
}

// https://stackoverflow.com/questions/260857/changing-website-favicon-dynamically/260876#260876
function setFavicon(faviconUrl: string | null) {
  let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']")
  if (!faviconUrl) {
    if (link) window.document.head.removeChild(link)
    return
  }
  if (!link) {
    link = window.document.createElement('link')
    link.rel = 'icon'
    window.document.head.appendChild(link)
  }
  link.href = faviconUrl
}
