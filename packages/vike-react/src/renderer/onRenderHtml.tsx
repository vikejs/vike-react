// https://vike.dev/onRenderHtml
export { onRenderHtml }

import React from 'react'
import { renderToString } from 'react-dom/server'
import { renderToStream } from 'react-streaming/server'
import { dangerouslySkipEscape, escapeInject, version } from 'vike/server'
import type { OnRenderHtmlAsync, PageContext } from 'vike/types'
import { PageContextProvider } from '../hooks/usePageContext.js'
import { getHeadSetting } from './getHeadSetting.js'
import { getPageElement } from './getPageElement.js'
import type { PageContextInternal } from '../types/PageContext.js'
import type { Head } from '../types/Config.js'
import { isReactElement } from '../utils/isReactElement.js'

checkVikeVersion()
addEcosystemStamp()

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const pageHtml = await getPageHtml(pageContext)
  const { headHtml, lang } = getHeadHtml(pageContext)

  return escapeInject`<!DOCTYPE html>
    <html lang='${lang}'>
      <head>${headHtml}</head>
      <body>
        <div id="root">${pageHtml}</div>
      </body>
    </html>`
}

async function getPageHtml(pageContext: PageContext) {
  let pageHtml: string | ReturnType<typeof dangerouslySkipEscape> | Awaited<ReturnType<typeof renderToStream>>
  if (!pageContext.Page) {
    pageHtml = ''
  } else {
    const page = getPageElement(pageContext)
    const { stream, streamIsRequired } = pageContext.config
    if (!stream && !streamIsRequired) {
      pageHtml = dangerouslySkipEscape(renderToString(page))
    } else {
      const disable = stream === false ? true : undefined
      pageHtml = await renderToStream(page, {
        webStream: typeof stream === 'string' ? stream === 'web' : undefined,
        userAgent:
          pageContext.headers?.['user-agent'] ||
          // TODO/eventually: remove old way of acccessing the User Agent header.
          // @ts-ignore
          pageContext.userAgent,
        disable
      })
    }
  }
  return pageHtml
}

function getHeadHtml(pageContext: PageContextInternal) {
  pageContext._headAlreadySet = true

  // Set by config
  const title = getHeadSetting('title', pageContext)
  const favicon = getHeadSetting('favicon', pageContext)
  const lang = getHeadSetting('lang', pageContext) || 'en'
  const titleTags = !title ? '' : escapeInject`<title>${title}</title><meta property="og:title" content="${title}" />`
  const faviconTag = !favicon ? '' : escapeInject`<link rel="icon" href="${favicon}" />`

  // <Head> set by +Head
  let headElementHtml1: HtmlFragment = ''
  const { Head } = pageContext.config
  if (Head) {
    headElementHtml1 = getHeadElementHtml(Head, pageContext)
  }

  // <Head> set by useConfig()
  let headElementHtml2: HtmlFragment = ''
  const headElement = pageContext._configFromHook?.Head
  if (headElement) {
    headElementHtml2 = getHeadElementHtml(headElement, pageContext)
  }

  // Not needed on the client-side, thus we remove it to save KBs sent to the client
  delete pageContext._configFromHook

  const headHtml = escapeInject`
    <meta charset="UTF-8" />
    ${titleTags}
    ${headElementHtml1}
    ${headElementHtml2}
    ${faviconTag}
  `
  return { headHtml, lang }
}

type HtmlFragment = string | ReturnType<typeof dangerouslySkipEscape>
function getHeadElementHtml(Head: Head, pageContext: PageContext): HtmlFragment {
  let headElement: React.ReactNode
  if (isReactElement(Head)) {
    headElement = Head
  } else {
    headElement = (
      <PageContextProvider pageContext={pageContext}>
        <Head />
      </PageContextProvider>
    )
  }
  if (pageContext.config.reactStrictMode !== false) {
    headElement = <React.StrictMode>{headElement}</React.StrictMode>
  }
  const headElementHtml = dangerouslySkipEscape(renderToString(headElement))
  return headElementHtml
}

// We don't need this anymore starting from vike@0.4.173 which added the `require` setting.
// TODO/eventually: remove this once <=0.4.172 versions become rare.
function checkVikeVersion() {
  if (version) {
    const versionParts = version.split('.').map((s) => parseInt(s, 10)) as [number, number, number]
    if (versionParts[0] > 0) return
    if (versionParts[1] > 4) return
    if (versionParts[2] >= 173) return
  }
  // We can leave it 0.4.173 until we entirely remove checkVikeVersion() (because starting vike@0.4.173 we use the new `require` setting).
  throw new Error('Update Vike to 0.4.173 or above')
}

// For improving error messages of:
// - react-streaming https://github.com/brillout/react-streaming/blob/6a43dd20c27fb5d751dca41466b06ee3f4f35462/src/server/useStream.ts#L21
// - vike https://github.com/vikejs/vike/blob/96c0155380ffebd4976ab076b58e86d8eb2d603a/vike/node/runtime/html/stream/react-streaming.ts#L31
function addEcosystemStamp() {
  const g = globalThis as Record<string, unknown>
  g._isVikeReactApp =
    /* Don't set to true so that consumers do `!!globalThis._isVikeApp` instead of `globalThis._isVikeApp === true`.
    true
    */
    // We use an object so that we can eventually, in the future, add helpful information as needed. (E.g. the vike-react version.)
    {}
}
