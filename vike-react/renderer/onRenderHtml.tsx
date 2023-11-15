// https://vike.dev/onRenderHtml
export { onRenderHtml }

import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import type { OnRenderHtmlAsync } from 'vike/types'
import { getTitle } from './getTitle.js'
import { getPageElement } from './getPageElement.js'
import { PageContextProvider } from './PageContextProvider.js'
import React from 'react'

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  let pageHtml = ''
  if (!!pageContext.Page) {
    const page = getPageElement(pageContext)
    pageHtml = renderToString(page)
  }

  const title = getTitle(pageContext)
  const titleTag = !title ? '' : escapeInject`<title>${title}</title>`

  const { description } = pageContext.config
  const descriptionTag = !description ? '' : escapeInject`<meta name="description" content="${description}" />`

  const { favicon } = pageContext.config
  const faviconTag = !favicon ? '' : escapeInject`<link rel="icon" href="${favicon}" />`

  const Head = pageContext.config.Head || (() => <></>)
  const head = (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Head />
      </PageContextProvider>
    </React.StrictMode>
  )
  const headHtml = renderToString(head)

  const lang = pageContext.config.lang || 'en'

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang='${lang}'>
      <head>
        <meta charset="UTF-8" />
        ${faviconTag}
        ${titleTag}
        ${descriptionTag}
        ${dangerouslySkipEscape(headHtml)}
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
      <!-- built with https://github.com/vikejs/vike-react -->
    </html>`

  return documentHtml
}
