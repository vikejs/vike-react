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

      /**
       * A component that defines the visual layout of the page common to several pages.
       *
       * Technically: the `<Layou>` component wraps the root component `<Page>`.
       *
       * https://vike.dev/Layout
       */
      Layout?: (props: { children: React.ReactNode }) => React.ReactNode

      /**
       * A component wrapping the the root component `<Page>`.
       *
       * https://vike.dev/Wrapper
       */
      Wrapper?: (props: { children: React.ReactNode }) => React.ReactNode

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
       * If `true`, the page is rendered twice: on the server-side (to HTML) and on the client-side (hydration).
       *
       * If `false`, the page is rendered only once in the browser.
       *
       * https://vike.dev/ssr
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
       * Client-side hook called before the page is rendered.
       */
      onBeforeRenderClient?: (pageContext: PageContextClient) => void

      /**
       * Client-side hook called after the page is rendered.
       */
      onAfterRenderClient?: (pageContext: PageContextClient) => void

      // Temporary until Wrapper is cumulative
      VikeReactQueryWrapper?: React.ReactNode
    }
  }
}
