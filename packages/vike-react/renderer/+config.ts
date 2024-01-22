import type { Config, ConfigEffect } from 'vike/types'
import type { Component } from './types.d.ts'

export default {
  // https://vike.dev/onRenderHtml
  onRenderHtml: 'import:vike-react/renderer/onRenderHtml:onRenderHtml',
  // https://vike.dev/onRenderClient
  onRenderClient: 'import:vike-react/renderer/onRenderClient:onRenderClient',

  passToClient: [
    // https://github.com/vikejs/vike-react/issues/25
    process.env.NODE_ENV !== 'production' && '$$typeof'
  ].filter(isNotFalse),

  // https://vike.dev/clientRouting
  clientRouting: true,
  hydrationCanBeAborted: true,

  // https://vike.dev/meta
  meta: {
    Head: {
      env: { server: true }
    },
    Layout: {
      env: { server: true, client: true }
    },
    title: {
      env: { server: true, client: true }
    },
    favicon: {
      env: { server: true, client: true }
    },
    lang: {
      env: { server: true, client: true }
    },
    ssr: {
      env: { config: true },
      effect: ssrEffect
    },
    stream: {
      env: { server: true }
    },
    VikeReactQueryWrapper: {
      env: { client: true, server: true }
    },
    Wrapper: {
      env: { client: true, server: true }
    }
  }
} satisfies Config

// We purposely define the ConfigVikeReact interface in this file: that way we ensure it's always applied whenever the user `import vikeReact from 'vike-react'`
// https://vike.dev/pageContext#typescript
declare global {
  namespace VikePackages {
    interface ConfigVikeReact {
      /** The page's root React component */
      Page?: Component
      /** React element rendered and appended into &lt;head>&lt;/head> */
      Head?: Component
      /** A component, usually common to several pages, that wraps the root component `Page` */
      Layout?: Component
      /** &lt;title>${title}&lt;/title> */
      title?: string
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
       * See https://vike.dev/render-modes
       *
       * @default true
       *
       */
      ssr?: boolean
      /**
       * Whether to stream the page's HTML. Requires Server-Side Rendering (`ssr: true`).
       *
       * @default false
       *
       */
      stream?: boolean

      VikeReactQueryWrapper?: Component

      Wrapper?: Component
    }
  }
}

function isNotFalse<T>(val: T | false): val is T {
  return val !== false
}

// Depending on the value of the setting `ssr`, we set other config options' `env` accordingly
function ssrEffect({ configDefinedAt, configValue }: Parameters<ConfigEffect>[0]): ReturnType<ConfigEffect> {
  if (typeof configValue !== 'boolean') {
    throw new Error(`${configDefinedAt} should be a boolean`)
  }

  return {
    meta: {
      // When the SSR flag is false, we want to render the page only in the
      // browser. We achieve this by making the `Page` implementation
      // accessible only on the client-side
      Page: {
        env: configValue
          ? { server: true, client: true } // default
          : { client: true }
      }
    }
  }
}
