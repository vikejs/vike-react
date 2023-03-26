export default onRenderHtml

import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server'
import { getTitle } from './getTitle'
import { getPageElement } from './getPageElement'
import type { PageContextServer } from './types'
import { PageContextProvider } from './PageContextProvider'
import React from 'react'

async function onRenderHtml(pageContext: PageContextServer) {
  const page = getPageElement(pageContext)
  const pageHtml = renderToString(page)

  const title = getTitle(pageContext)
  const titleTag = !title ? '' : escapeInject`<title>${title}</title>`

  const { description } = pageContext.exports
  const descriptionTag = !description ? '' : escapeInject`<meta name="description" content="${description}" />`

  const Head = pageContext.exports.Head || (() => <></>)
  const head = (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Head />
      </PageContextProvider>
    </React.StrictMode>
  )
  const headHtml = renderToString(head)

  const lang = pageContext.exports.lang || 'en'

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang='${lang}'>
      <head>
        <meta charset="UTF-8" />
        ${titleTag}
        ${descriptionTag}
        ${dangerouslySkipEscape(headHtml)}
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`

  return {
    documentHtml
  }
}
