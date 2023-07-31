import type { Config as ConfigCore } from 'vite-plugin-ssr/types'
import type { Component } from './types'

import type { Effect } from 'vite-plugin-ssr/types'

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
  /**
   * If true, render mode is SSR or pre-rendering (aka SSG). In other words, the
   * page's HTML will be rendered at build-time or request-time.
   * If false, render mode is SPA. In other words, the page will only be
   * rendered in the browser.
   *
   * See https://vite-plugin-ssr.com/render-modes
   *
   * @default true
   *
   */
  ssr?: boolean
  Page?: Component
}

// Depending on the value of `config.meta.ssr`, set config options' `env`
// accordingly.
// See https://vite-plugin-ssr.com/meta#modify-existing-configurations
const toggleSsrRelatedConfig: Effect = ({ configDefinedAt, configValue }) => {
  if (typeof configValue !== 'boolean') {
    throw new Error(`${configDefinedAt} should be a boolean`)
  }

  const result = {
    meta: {
      // We want this config available in onRenderClient and onRenderHtml in
      // any case.
      ssr: {
        env: 'server-and-client'
      },
    } as Record<string, any>
  }

  if (configValue === false) {
    // The SSR flag is false, so we want to render the page only in the browser.
    // Let's make sure onBeforeRender is also run in the browser and not only
    // in the server (which is the default).
    result.meta['onBeforeRender'] = {
      env: 'server-and-client'
    }
  }

  return result
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
      // Note: we need an effect in order to toggle `onBeforeRender.env`.
      // Effects are only supported with `env: 'config-only'`. However we need
      // to be able to read this config in onRenderClient and onRenderHtml. This
      // is why we also toggle `ssr.env` back to `server-and-client` in the
      // effect.
      env: 'config-only',
      effect: toggleSsrRelatedConfig
    },
  }
} satisfies ConfigCore
