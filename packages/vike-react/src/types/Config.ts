// https://vike.dev/meta#typescript
import type { ImportString, PageContextClient } from 'vike/types'

declare global {
  namespace Vike {
    interface Config {
      /** The page's root React component */
      Page?: () => React.ReactNode

      /** React element rendered and appended into &lt;head>&lt;/head> */
      Head?: () => React.ReactNode

      /**
       * A component that defines the visual layout of the page common to several pages.
       *
       * Technically: the `<Layout>` component wraps the root component `<Page>`.
       *
       * https://vike.dev/Layout
       */
      Layout?: Layout

      /**
       * A component wrapping the the root component `<Page>`.
       *
       * https://vike.dev/Wrapper
       */
      Wrapper?: Wrapper | ImportString

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
       * https://vike.dev/stream
       *
       */
      stream?: boolean

      /**
       * Whether the existence of the React SSR stream is required (some integrations require it).
       *
       * HTML Streaming can still be disabled: the SSR stream is awaited and converted to a string.
       */
      streamIsRequired?: boolean

      /**
       * Whether to use `<StrictMode>`.
       *
       * https://vike.dev/reactStrictMode
       *
       * @default true
       */
      reactStrictMode?: boolean

      /**
       * Client-side hook called before the page is rendered.
       *
       * https://vike.dev/onBeforeRenderClient
       */
      onBeforeRenderClient?: (pageContext: PageContextClient) => void

      /**
       * Client-side hook called after the page is rendered.
       *
       * https://vike.dev/onAfterRenderClient
       */
      onAfterRenderClient?: (pageContext: PageContextClient) => void
    }
    interface ConfigResolved {
      Wrapper?: Wrapper[]
      Layout?: Layout[]
    }
  }
}

type Wrapper = (props: { children: React.ReactNode }) => React.ReactNode
type Layout = Wrapper
