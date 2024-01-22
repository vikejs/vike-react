import type { Component } from './Component.js'

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
