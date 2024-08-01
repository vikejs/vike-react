// https://vike.dev/meta#typescript
import type { ImportString, PageContextClient, PageContext } from 'vike/types'
import type { TagAttributes } from '../utils/getTagAttributesString.js'
import type { Viewport } from '../renderer/onRenderHtml.js'

declare global {
  namespace Vike {
    interface Config {
      /** The page's root React component */
      Page?: () => React.ReactNode

      /**
       * Add arbitrary `<head>` tags.
       *
       * https://vike.dev/Head
       */
      Head?: Head

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
      title?: PlainOrGetter<string>

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
      description?: PlainOrGetter<string>

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
      image?: PlainOrGetter<string>

      /**
       * Set the page's width shown to the user on mobile/tablet devices.
       *
       * https://vike.dev/viewport
       *
       * @default "responsive"
       */
      viewport?: Viewport

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
      favicon?: PlainOrGetter<string>

      /**
       * Set the page's language (`<html lang>`).
       *
       * @default 'en'
       *
       * https://vike.dev/lang
       */
      lang?: PlainOrGetter<string> | null

      /**
       * Add tag attributes such as `<html class="dark">`.
       *
       * https://vike.dev/htmlAttributes
       */
      htmlAttributes?: TagAttributes

      /**
       * Add tag attributes such as `<body class="dark">`.
       *
       * https://vike.dev/bodyAttributes
       */
      bodyAttributes?: TagAttributes

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
       *
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
      Loading?: Loading | ImportString
    }
    interface ConfigResolved {
      Wrapper?: Wrapper[]
      Layout?: Layout[]
      bodyAttributes?: TagAttributes[]
      htmlAttributes?: TagAttributes[]
    }
  }
}

type PlainOrGetter<T> = T | ((pageContext: PageContext) => T)

export type Head = React.ReactNode | (() => React.ReactNode)
type Wrapper = (props: { children: React.ReactNode }) => React.ReactNode
type Layout = Wrapper
type Loading = { component?: () => React.ReactNode; layout?: () => React.ReactNode }

// It preserves JSDocs
type PickWithoutGetter<T, K extends keyof T> = {
  [P in K]: Exclude<T[P], Function>
}
export type ConfigFromHook = PickWithoutGetter<Vike.Config, 'Head' | 'title' | 'description' | 'image'>
export type ConfigFromHookResolved = {
  Head?: Head[]
  title?: string
  description?: string
  image?: string
}
