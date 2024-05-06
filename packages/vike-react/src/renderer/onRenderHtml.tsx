// https://vike.dev/onRenderHtml
export { onRenderHtml }

import { renderToString } from 'react-dom/server'
import { renderToStream } from 'react-streaming/server'
import { escapeInject, dangerouslySkipEscape, version } from 'vike/server'
import { getHeadSetting } from './getHeadSetting.js'
import { getPageElement } from './getPageElement.js'
import { PageContextProvider } from '../hooks/usePageContext.js'
import React from 'react'
import type { OnRenderHtmlAsync } from 'vike/types'
import { getHtmlTags } from './getHtmlTags.js'

checkVikeVersion()
addEcosystemStamp()

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  ;(pageContext as any)._htmlHeadAlreadySet = false

  // TODO/next-major-release: remove
  const title = getHeadSetting('title', pageContext)
  const favicon = getHeadSetting('favicon', pageContext)
  const lang = getHeadSetting('lang', pageContext)

  const titleTag = !title ? '' : escapeInject`<title>${title}</title>`
  const faviconTag = !favicon ? '' : escapeInject`<link rel="icon" href="${favicon}"/>`
  const langAttr = !lang ? '' : escapeInject` lang='${lang}'`

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
    const {
      stream,
      // @ts-expect-error
      _streamIsRequied
    } = pageContext.config
    if (!stream && !_streamIsRequied) {
      pageView = dangerouslySkipEscape(renderToString(page))
    } else {
      const disable = stream === false ? true : undefined
      pageView = await renderToStream(page, { userAgent: pageContext.userAgent, disable })
    }
  }

  let { htmlTags, htmlAttr, bodyAttr, rootAttr } = getHtmlTags(pageContext)
  if (langAttr !== '') htmlAttr = ''

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html${langAttr}${dangerouslySkipEscape(htmlAttr)}>
      <head>
        <meta charset="UTF-8" />
        ${titleTag}
        ${headHtml}
        ${faviconTag}
        ${dangerouslySkipEscape(htmlTags)}
      </head>
      <body${dangerouslySkipEscape(bodyAttr)}}>
        <div id="react-root"${dangerouslySkipEscape(rootAttr)}>${pageView}</div>
      </body>
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
  throw new Error('Update Vike to 0.4.147 or above')
}

// Used by:
// - react-streaming (to improve error messages, see https://github.com/brillout/react-streaming/blob/70c168de1e97b9c4385a4c3002b5013f1e406341/src/utils/isVikeReactApp.ts#L4)
function addEcosystemStamp() {
  const g = globalThis as Record<string, unknown>
  g._isVikeReactApp =
    /* Don't set to true so that consumers do `!!globalThis._isVikeApp` instead of `globalThis._isVikeApp === true`.
    true
    */
    // We use an object so that we can eventually, in the future, add helpful information as needed. (E.g. the vike-react version.)
    {}
}
