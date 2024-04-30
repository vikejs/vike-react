export { getHtmlTags }

import type { PageContextServer } from 'vike/types'
import type { Document } from '../types/Document.js'
import { getDocument, getDocumentElementsIsomoprh } from './getDocument.js'

function getHtmlTags(pageContext: PageContextServer) {
  const { title, lang, favicon } = getDocumentElementsIsomoprh(pageContext)

  const document = getDocument(pageContext)

  const viewportContent = getViewportContent(document.viewport)

  const htmlTagAttributes = document.htmlTagAttributes ?? {}
  if (!htmlTagAttributes.lang) htmlTagAttributes.lang = lang ?? 'en'
  const htmlAttr = getTagAttributesString(htmlTagAttributes)
  const bodyAttr = getTagAttributesString(document.bodyTagAttributes ?? {})
  const rootAttr = getTagAttributesString(document.rootTagAttributes ?? {})

  const htmlTags = [
    title && `<title>${escapeHtml(title)}</title>`,
    favicon && `<link rel="icon" href="${escapeHtml(favicon)}"/>`,
    viewportContent && `<meta name="viewport" content="${escapeHtml(viewportContent)}">`
  ]
    .filter(Boolean)
    .join('\n')

  return {
    htmlTags,
    htmlAttr,
    bodyAttr,
    rootAttr
  }
}

// Copied from: https://github.com/vikejs/vike/blob/main/vike/utils/escapeHtml.ts
// Permalink:   https://github.com/vikejs/vike/blob/850921618b67f1160059fe0a9118576dea0ac054/vike/utils/escapeHtml.ts
function escapeHtml(unsafeString: string): string {
  const safe = unsafeString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
  return safe
}

function getViewportContent(viewport: Document['viewport']): string {
  if (
    // User explicitly opting-out
    viewport === null ||
    // Default
    viewport === undefined
  ) {
    // Don't set any tag <meta name="viewport">
    return ''
  } else if (viewport === 'responsive') {
    // `user-scalable=no` isn't needed anymore:
    //   - https://stackoverflow.com/questions/22354435/to-user-scalable-no-or-not-to-user-scalable-no/22544312#comment120949420_22544312
    return 'width=device-width,initial-scale=1'
  } else if (typeof viewport === 'number') {
    return `width=${viewport}`
  } else {
    return viewport.raw
  }
}

function getTagAttributesString(attributes: Record<string, string>): string {
  let tagAttributesString = Object.entries(attributes)
    .map(([key, val]) => `${ensureIsValidAttributeName(key)}=${JSON.stringify(val)}`)
    .join(' ')
  if (tagAttributesString.length > 0) {
    tagAttributesString = ' ' + tagAttributesString
  }
  return tagAttributesString
}

function ensureIsValidAttributeName(str: string): string {
  if (!/^[a-z][a-z0-9\-]*$/i.test(str) || str.endsWith('-')) throw new Error(`Invalid HTML attribute name ${str}`)
  return str
}
