// https://vike.dev/meta#typescript
import type { PageContextClient } from 'vike/types'

declare global {
  // As a Vike user, use Vike.Config instead of VikePackages.ConfigVikeReact (see https://vike.dev/meta#typescript)
  namespace VikePackages {
    interface ConfigVikeReact {
      /** The page's root React component */
      Page?: () => React.ReactNode
      /** React element rendered and appended into &lt;head>&lt;/head> */
      Head?: () => React.ReactNode
      /** A component, usually common to several pages, that wraps the root component `Page` */
      Layout?: (props: { children: React.ReactNode }) => React.ReactNode
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
      /**
       * Client-side hook called after the page is rendered.
       */
      onAfterRenderClient?: (pageContext: PageContextClient) => void

      VikeReactQueryWrapper?: React.ReactNode

      Wrapper?: (props: { children: React.ReactNode }) => React.ReactNode
    }
  }
}
