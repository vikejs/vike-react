// https://vike.dev/onRenderHtml
export { onRenderHtml }

import React from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { renderToStream } from 'react-streaming/server'
import { dangerouslySkipEscape, escapeInject } from 'vike/server'
import type { PageContextServer } from 'vike/types'
import { PageContextProvider } from '../hooks/usePageContext.js'
import { getHeadSetting } from './getHeadSetting.js'
import { getPageElement } from './getPageElement.js'
import type { PageContextInternal } from '../types/PageContext.js'
import type { Head } from '../types/Config.js'
import { isReactElement } from '../utils/isReactElement.js'
import { getTagAttributesString, type TagAttributes } from '../utils/getTagAttributesString.js'
import { assert } from '../utils/assert.js'
import { callCumulativeHooks } from '../utils/callCumulativeHooks.js'
import { resolveReactOptions } from './resolveReactOptions.js'
import { isNotNullish } from '../utils/isNotNullish.js'
import { isObject } from '../utils/isObject.js'
import { isType } from '../utils/isType.js'

addEcosystemStamp()

async function onRenderHtml(
  pageContext: PageContextServer & PageContextInternal,
): Promise<ReturnType<typeof escapeInject>> {
  await renderPageToHtml(pageContext)

  const headHtml = getHeadHtml(pageContext)

  const { bodyHtmlBegin, bodyHtmlEnd } = await getBodyHtmlBoundary(pageContext)

  const { htmlAttributesString, bodyAttributesString } = getTagAttributes(pageContext)

  // Not needed on the client-side, thus we remove it to save KBs sent to the client
  delete pageContext._configFromHook

  // pageContext.{pageHtmlString,pageHtmlStream} is set by renderPageToHtml() and can be overridden by user at onAfterRenderHtml()
  let pageHtmlStringOrStream: string | ReturnType<typeof dangerouslySkipEscape> | PageHtmlStream =
    // Set to empty string if SSR is disabled
    ''
  if (pageContext.pageHtmlString) {
    assert(pageContext.pageHtmlStream === undefined)
    pageHtmlStringOrStream = dangerouslySkipEscape(pageContext.pageHtmlString)
  }
  if (pageContext.pageHtmlStream) {
    assert(pageContext.pageHtmlString === undefined)
    pageHtmlStringOrStream = pageContext.pageHtmlStream
  }

  return escapeInject`<!DOCTYPE html>
    <html${dangerouslySkipEscape(htmlAttributesString)}>
      <head>
        <meta charset="UTF-8" />
        ${headHtml}
      </head>
      <body${dangerouslySkipEscape(bodyAttributesString)}>
        ${bodyHtmlBegin}
        <div id="root">${pageHtmlStringOrStream}</div>
        ${bodyHtmlEnd}
      </body>
    </html>`
}

export type PageHtmlStream = Awaited<ReturnType<typeof renderToStream>>
async function renderPageToHtml(pageContext: PageContextServer) {
  if (pageContext.Page) pageContext.page = getPageElement(pageContext).page

  // https://github.com/vikejs/vike-react/issues/87#issuecomment-2488742744
  await callCumulativeHooks(pageContext.config.onBeforeRenderHtml, pageContext)

  const { renderToStringOptions } = resolveReactOptions(pageContext)

  if (pageContext.page) {
    const streamSetting = resolveStreamSetting(pageContext)
    if (!streamSetting.enable && !streamSetting.require) {
      const pageHtmlString = renderToString(pageContext.page, renderToStringOptions)
      pageContext.pageHtmlString = pageHtmlString
    } else {
      const pageHtmlStream = await renderToStream(pageContext.page, {
        webStream: !streamSetting.type
          ? /* Let react-streaming decide which stream type to use.
            false
            */
            undefined
          : streamSetting.type === 'web',
        userAgent:
          pageContext.headers?.['user-agent'] ||
          // TO-DO/eventually: remove old way of acccessing the User Agent header.
          // @ts-ignore
          pageContext.userAgent,
        disable:
          // +stream.require is true  => default +stream.enable is true
          // +stream.require is false => default +stream.enable is false
          streamSetting.enable === false
            ? true
            : /* Don't override disabling when bot is detected.
              false,
              */
              undefined,
      })
      pageContext.pageHtmlStream = pageHtmlStream
    }
  }

  // https://github.com/vikejs/vike/discussions/1804#discussioncomment-10394481
  await callCumulativeHooks(pageContext.config.onAfterRenderHtml, pageContext)
}

function getHeadHtml(pageContext: PageContextServer & PageContextInternal) {
  pageContext._headAlreadySet = true

  const favicon = getHeadSetting<string | null>('favicon', pageContext)
  const title = getHeadSetting<string | null>('title', pageContext)
  const description = getHeadSetting<string | null>('description', pageContext)
  const image = getHeadSetting<string | null>('image', pageContext)

  const faviconTag = !favicon ? '' : escapeInject`<link rel="icon" href="${favicon}" />`
  const titleTags = !title ? '' : escapeInject`<title>${title}</title><meta property="og:title" content="${title}" />`
  const descriptionTags = !description
    ? ''
    : escapeInject`<meta name="description" content="${description}" /><meta property="og:description" content="${description}" />`
  const imageTags = !image
    ? ''
    : escapeInject`<meta property="og:image" content="${image}"><meta name="twitter:card" content="summary_large_image">`
  const viewportTag = dangerouslySkipEscape(getViewportTag(getHeadSetting<Viewport>('viewport', pageContext)))

  const headElementsHtml = dangerouslySkipEscape(
    [
      // Added by +Head
      ...(pageContext.config.Head ?? []),
      // Added by useConfig()
      ...(pageContext._configFromHook?.Head ?? []),
    ]
      .filter((Head) => Head !== null && Head !== undefined)
      .map((Head) => getHeadElementHtml(Head, pageContext))
      .join('\n'),
  )

  const headHtml = escapeInject`
    ${titleTags}
    ${viewportTag}
    ${headElementsHtml}
    ${faviconTag}
    ${descriptionTags}
    ${imageTags}
  `
  return headHtml
}
function getHeadElementHtml(Head: NonNullable<Head>, pageContext: PageContextServer): string {
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
  return renderToStaticMarkup(headElement)
}

function getTagAttributes(pageContext: PageContextServer) {
  let lang = getHeadSetting<string | null>('lang', pageContext)
  // Don't set `lang` to its default value if it's `null` (so that users can set it to `null` in order to remove the default value)
  if (lang === undefined) lang = 'en'

  const bodyAttributes = mergeTagAttributesList(getHeadSetting<TagAttributes[]>('bodyAttributes', pageContext))
  const htmlAttributes = mergeTagAttributesList(getHeadSetting<TagAttributes[]>('htmlAttributes', pageContext))

  const bodyAttributesString = getTagAttributesString(bodyAttributes)
  const htmlAttributesString = getTagAttributesString({ ...htmlAttributes, lang: lang ?? htmlAttributes.lang })

  return { htmlAttributesString, bodyAttributesString }
}
function mergeTagAttributesList(tagAttributesList: TagAttributes[] = []) {
  const tagAttributes: TagAttributes = {}
  tagAttributesList.forEach((tagAttrs) => Object.assign(tagAttributes, tagAttrs))
  return tagAttributes
}

export type Viewport = 'responsive' | number | null
function getViewportTag(viewport: Viewport | undefined): string {
  if (viewport === 'responsive' || viewport === undefined) {
    // `user-scalable=no` isn't recommended anymore:
    //   - https://stackoverflow.com/questions/22354435/to-user-scalable-no-or-not-to-user-scalable-no/22544312#comment120949420_22544312
    return '<meta name="viewport" content="width=device-width,initial-scale=1">'
  }
  if (typeof viewport === 'number') {
    return `<meta name="viewport" content="width=${viewport}">`
  }
  return ''
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

async function getBodyHtmlBoundary(pageContext: PageContextServer) {
  const bodyHtmlBegin = dangerouslySkipEscape(
    (await callCumulativeHooks(pageContext.config.bodyHtmlBegin, pageContext)).join(''),
  )
  const bodyHtmlEnd = dangerouslySkipEscape(
    (await callCumulativeHooks(pageContext.config.bodyHtmlEnd, pageContext)).join(''),
  )
  return { bodyHtmlBegin, bodyHtmlEnd }
}

type StreamSetting = {
  type: 'node' | 'web' | null
  enable: boolean | null
  require: boolean
}
function resolveStreamSetting(pageContext: PageContextServer): StreamSetting {
  const {
    stream,
    // TO-DO/eventually: remove +streamIsRequired
    //  - Let's remove it once following last vike-react-{query,apollo} releases using +streamIsRequired can be considered old versions.
    //    - Last vike-react-query version that uses +streamIsRequired was 0.1.3
    //    - Last vike-react-apollo version that uses +streamIsRequired was 0.1.1
    //    - New vike-react-{query,apollo} versions using +stream.require instead +streamIsRequired were released on May 29th 2025
    //  - Remove it in a minor release (AFAICT it's only used by vike-react-{query,apollo})
    //    - Add a `Negligible Breaking Change`
    streamIsRequired,
  } = pageContext.config
  const streamSetting: StreamSetting = {
    type: null,
    enable: null,
    require: streamIsRequired ?? false,
  }
  stream
    ?.reverse()
    .filter(isNotNullish)
    .forEach((setting) => {
      if (typeof setting === 'boolean') {
        streamSetting.enable = setting
        return
      }
      if (typeof setting === 'string') {
        streamSetting.type = setting
        streamSetting.enable = true
        return
      }
      if (isObject(setting)) {
        if (setting.enable !== null) streamSetting.enable = setting.enable ?? true
        if (setting.require !== undefined) streamSetting.require = setting.require
        if (setting.type !== undefined) streamSetting.type = setting.type
        return
      }
      isType<never>(setting)
      throw new Error(`Unexpected +stream value ${setting}`)
    })
  return streamSetting
}
