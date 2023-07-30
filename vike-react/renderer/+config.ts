import type { Config as ConfigCore } from 'vite-plugin-ssr/types'
import type { Component } from './types'

export type Config = ConfigCore & {
  /** React element renderer and appended into &lt;head>&lt;/head> */
  Head?: Component
  Layout?: Component
  /** &lt;title>${title}&lt;/title> */
  title?: string
  /** &lt;meta name="description" content="${description}" /> */
  description?: string
  /** &lt;link rel="icon" href="${favicon}" /> */
  favicon?: string
  /** &lt;html lang="${lang}">
   *
   *  @default 'en'
   *
   */
  lang?: string
  /** If true, render mode is SSR. If false, render mode is SPA. See
   * https://vite-plugin-ssr.com/render-modes
   *
   *  @default true
   *
   */
  ssr?: boolean
  Page?: Component
}

export default {
  onRenderHtml: 'import:vike-react/renderer/onRenderHtml',
  onRenderClient: 'import:vike-react/renderer/onRenderClient',
  passToClient: ['pageProps', 'title'],
  clientRouting: true,
  hydrationCanBeAborted: true,
  meta: {
    Head: {
      env: 'server-only'
    },
    Layout: {
      env: 'server-and-client'
    },
    title: {
      env: 'server-and-client'
    },
    description: {
      env: 'server-only'
    },
    favicon: {
      env: 'server-only'
    },
    lang: {
      env: 'server-only'
    },
    ssr: {
      env: 'server-only'
    }
  }
} satisfies ConfigCore
