// https://vike.dev/onRenderHtml
export { onRenderHtml }

import { renderToString } from 'react-dom/server'
import { renderToStream } from 'react-streaming/server'
import { escapeInject, dangerouslySkipEscape, version } from 'vike/server'
import { getTitle } from './getTitle.js'
import { getPageElement } from './getPageElement.js'
import { PageContextProvider } from './PageContextProvider.js'
import React from 'react'
import type { OnRenderHtmlAsync } from 'vike/types'
import { getLang } from './getLang.js'

checkVikeVersion()

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {

  const { stream, favicon, description } = pageContext.config
  const faviconTag = !favicon ? '' : escapeInject`<link rel="icon" href="${favicon}" />`
  const descriptionTag = !description ? '' : escapeInject`<meta name="description" content="${description}" />`

  const title = getTitle(pageContext)
  const titleTag = !title ? '' : escapeInject`<title>${title}</title>`

  const lang = getLang(pageContext) || 'en'

  const Head = pageContext.config.Head || (() => <></>)
  const head = (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Head />
      </PageContextProvider>
    </React.StrictMode>
  )

  const headHtml = dangerouslySkipEscape(renderToString(head))

  let pageView: string | ReturnType<typeof dangerouslySkipEscape> | Awaited<ReturnType<typeof renderToStream>>
  if (!pageContext.Page) {
    pageView = ''
  } else {
    const page = getPageElement(pageContext)
    pageView = !stream
      ? dangerouslySkipEscape(renderToString(page))
      : await renderToStream(page, { userAgent: pageContext.userAgent })
  }

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang='${lang}'>
      <head>
        <meta charset="UTF-8" />
        ${faviconTag}
        ${titleTag}
        ${descriptionTag}
        ${headHtml}
      </head>
      <body>
        <div id="page-view">${pageView}</div>
      </body>
      <!-- built with https://github.com/vikejs/vike-react -->
    </html>`

  return documentHtml
}

function checkVikeVersion() {
  if (version) {
    const versionParts = version.split('.').map((s) => parseInt(s, 10)) as [number, number, number]
    if (versionParts[0] > 0) return
    if (versionParts[1] > 4) return
    if (versionParts[2] >= 147) return
  }
  throw new Error('Update Vike to its latest version (or vike@0.4.147 and any version above)')
}
