import type { ImportString, PageContextServer, PageContext, PageContextClient } from 'vike/types'
import type { TagAttributes } from '../utils/getTagAttributesString.js'
import type { Viewport } from '../integration/onRenderHtml.js'
import type { ConfigsCumulative } from '../hooks/useConfig/configsCumulative.js'

// https://vike.dev/meta#typescript
declare global {
  namespace Vike {
    interface Config {
      /**
       * The page's root React component.
       *
       * https://vike.dev/Page
       */
      Page?: () => React.ReactNode

      /**
       * Add arbitrary `<head>` tags.
       *
       * https://vike.dev/Head
       */
      Head?: Head

      /**
       * A component that defines the visual layout common to several pages.
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

      /**
       * Set the page's tilte.
       *
       * Generates:
       * ```jsx
       * <head>
       *   <title>{title}</title>
       *   <meta property="og:title" content={title} />
       * </head>
       * ```
       *
       * https://vike.dev/title
       */
      title?: string | null | ((pageContext: PageContext_) => string | null | undefined)

      /**
       * Set the page's description.
       *
       * Generates:
       * ```jsx
       * <head>
       *   <meta name="description" content={description}>
       *   <meta property="og:description" content={description}>
       * </head>
       * ```
       *
       * https://vike.dev/description
       */
      description?: string | null | ((pageContext: PageContextServer) => string | null | undefined)

      /**
       * Set the page's preview image upon URL sharing.
       *
       * Generates:
       * ```jsx
       * <head>
       *   <meta property="og:image" content={image}>
       *   <meta name="twitter:card" content="summary_large_image">
       * </head>
       * ```
       *
       * https://vike.dev/image
       */
      image?: string | null | ((pageContext: PageContextServer) => string | null | undefined)

      /**
       * Set the page's width shown to the user on mobile/tablet devices.
       *
       * @default "responsive"
       *
       * https://vike.dev/viewport
       */
      viewport?: Viewport | ((pageContext: PageContextServer) => Viewport | undefined)

      /**
       * Set the page's favicon.
       *
       * Generates:
       * ```jsx
       * <head>
       *   <link rel="icon" href={favicon} />
       * </head>
       * ```
       *
       * https://vike.dev/favicon
       */
      favicon?: string | null | ((pageContext: PageContextServer) => string | null | undefined)

      /**
       * Set the page's language (`<html lang>`).
       *
       * @default 'en'
       *
       * https://vike.dev/lang
       */
      lang?: string | null | ((pageContext: PageContext_) => string | null | undefined)

      /**
       * Raw HTML injected at the start of `<body>`.
       *
       * https://vike.dev/bodyHtmlBegin
       */
      bodyHtmlBegin?: BodyHtmlBoundary

      /**
       * Raw HTML injected at the end of `<body>`.
       *
       * https://vike.dev/bodyHtmlEnd
       */
      bodyHtmlEnd?: BodyHtmlBoundary

      /**
       * Add tag attributes such as `<html class="dark">`.
       *
       * https://vike.dev/htmlAttributes
       */
      htmlAttributes?: TagAttributes | ((pageContext: PageContextServer) => TagAttributes | undefined)

      /**
       * Add tag attributes such as `<body class="dark">`.
       *
       * https://vike.dev/bodyAttributes
       */
      bodyAttributes?: TagAttributes | ((pageContext: PageContextServer) => TagAttributes | undefined)

      /**
       * If `true`, the page is rendered twice: on the server-side (to HTML) and on the client-side (hydration).
       *
       * If `false`, the page is rendered only once in the browser.
       *
       * @default true
       *
       * https://vike.dev/ssr
       */
      ssr?: boolean

      /**
       * Whether to stream the page's HTML.
       *
       * Requires Server-Side Rendering (`ssr: true`).
       *
       * A Node.js Stream is used whenever possible, falling back to a Web Stream otherwise.
       *
       * By setting the value to `web` or `node`, you force the usage of a Web Stream or Node.js Stream.
       *
       * @default false
       *
       * https://vike.dev/stream
       */
      stream?: boolean | 'node' | 'web'

      /**
       * Whether the existence of the React SSR stream is required (some integrations require it).
       *
       * HTML Streaming can still be disabled: the SSR stream is awaited and converted to a string.
       */
      streamIsRequired?: boolean

      /**
       * Whether to use `<StrictMode>`.
       *
       * @default true
       *
       * https://vike.dev/reactStrictMode
       */
      reactStrictMode?: boolean

      /**
       * Hook called right after rendering the page's root React component to HTML.
       *
       * https://vike.dev/onAfterRenderHtml
       */
      onAfterRenderHtml?: (pageContext: PageContextServer) => void

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

      /**
       * Define loading animations.
       *
       * https://vike.dev/Loading
       */
      Loading?: Loading | ImportString
    }
    interface ConfigResolved {
      Wrapper?: Wrapper[]
      Layout?: Layout[]
      Head?: Head[]
      bodyHtmlBegin?: BodyHtmlBoundary[]
      bodyHtmlEnd?: BodyHtmlBoundary[]
      bodyAttributes?: TagAttributes[]
      htmlAttributes?: TagAttributes[]
      onAfterRenderHtml?: Function[]
      onBeforeRenderClient?: Function[]
      onAfterRenderClient?: Function[]
    }
  }
}

// Be able to reference it from within `namespace Vike`
// - https://stackoverflow.com/questions/46559021/typescript-use-of-global-type-inside-namespace-with-same-type
// - https://github.com/Microsoft/TypeScript/issues/983
type PageContext_ = PageContext

type BodyHtmlBoundary = string | ((pageContext: PageContext) => string)

export type Head = React.ReactNode | (() => React.ReactNode)
type Wrapper = (props: { children: React.ReactNode }) => React.ReactNode
type Layout = Wrapper
type Loading = { component?: () => React.ReactNode; layout?: () => React.ReactNode }

// JSDocs are preserved
type PickWithoutGetter<T, K extends keyof T> = {
  [P in K]: Exclude<T[P], Function>
}
export type ConfigFromHook = PickWithoutGetter<
  Vike.Config,
  'Head' | 'title' | 'description' | 'image' | 'favicon' | 'lang' | 'viewport' | 'bodyAttributes' | 'htmlAttributes'
>
export type ConfigFromHookResolved = Omit<ConfigFromHook, ConfigsCumulative> &
  Pick<Vike.ConfigResolved, ConfigsCumulative>
