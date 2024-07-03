import type { PageContextClient, PageContextServer } from 'vike/types'

export type { Document }

// ??
//  - bodyAttribtutes
//  - bodyStart or bodyHtmlStart?
//  - Make bodyHtmlStart a global config? See discussion with pdanpdan. If yes then no need to change the DOM and bodyHtmlStart is a good name.
//  - bodyStart: { dangerouslyInject: '<span>some html</span>' }

// TODO:
//  - locale default
//  - <meta property="og:type" content="website">
//  - icon large, small, ...
//  - preview images with different sizes?
//  - dir? https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir
//  - Can lang be set to en-US instead of en?
type Document = {
  title?: string
  /**
   * @default: ({ title, name }) => tile ? name ? : && !name ? `${title} | ${name} : !name ?`
   */
  titleTemplate?: (pageContext: PageContextClient | PageContextServer) => string
  name?: string
  description?: string

  // TODO/next-major-release: change default to 'responsive'
  /**
   * On mobile/tablet devices, whether your page is responsive or should be zoomed out (see [1]).
   *
   * This setting sets the `<meta name="viewport">` tag (see [2]).
   *
   * Default: `null`.
   *
   * - When set to `'responsive'`, the page's width corresponds to the device width's (it isn't zoomed out).
   * - When set to a `number`, the page's viewport width is set that number (`px`) on mobile/tablet devices. For example, if your page looks/works well only starting from 1000px, then set the value to `1000` so that the page's width is 1000px even on a mobile device with a physical width of 500px: the page is then zoomed out at a 0.5 scale.
   * - When set to `null`, the `<meta name="viewport">` tag isn't set, falling back to the browser's default. We don't recommend this and instead consider explicitly setting a `number` instead.
   *
   * See also:
   * - Difference between responsive and zoomed out: [1].
   * - Docs about `<meta name="viewport">`: [2].
   *
   * [1]: https://stackoverflow.com/questions/14775195/is-the-viewport-meta-tag-really-necessary/14775557#14775557
   * [2]: https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag
   *
   * @default null
   */
  viewport?: 'responsive' | number | null

  /**
   *
   *  <html lang="en">
   *  <meta property="og:locale" content="en_GB">
   *
   */
  locale?: string

  /*
  htmlAttrs
  bodyAttrs
  bodyHtmlStart
  bodyHtmlEnd
  */
  htmlTagAttributes?: Record<string, string>
  bodyTagAttributes?: Record<string, string>
  /* Not really needed I think
  rootTagAttributes?: Record<string, string>
  */

  /** Website icon (aka favicon).
   *
   *  <link rel="icon" href="/favicon.ico">
   *  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
   */
  icon?:
    | string
    | {
        href: string
        sizes?: string
        apple?: boolean
      }[]

  /**
   * Preview image for social sharing.
   *
   * <meta property="og:image" content="https://vitejs.dev/og-image.png">
   * <meta name="twitter:card" content="summary_large_image">
   */
  image?:
    | string
    | {
        url: string
        // <meta name="twitter:card" content="summary_large_image">
        size?: 'summary_large_image' | '??'
        alt?: string
      }

  // <meta name="twitter:site" content="@vike_js">
  twitter?: string

  /**
   * Canonical URL.
   *
   * <meta property="og:url" content="https://www.mywebsite.com/page">
   * <link rel="canonical" href="https://www.mywebsite.com/page">
   */
  canonical?: string

  /**
   * The web manifest URL.
   *
   *   `<link rel="manifest" href="${document.manifest}">`
   *
   * https://developer.mozilla.org/en-US/docs/Web/Manifest
   * https://vike.dev/document
   */
  manifest?: string | Record<string, unknown>

  /**
   * The UI frame color for mobile.
   *
   * `<meta name="theme-color" content="${document.themeColor}">`
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name/theme-color
   * https://vike.dev/document
   */
  themeColor?:
    | string
    | {
        /**
         * `<meta name="theme-color" content="${document.themeColor.dark}" media="(prefers-color-scheme: dark)">`
         *
         * https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
         * https://vike.dev/document
         */
        dark: string
        /**
         * `<meta name="theme-color" content="${document.themeColor.light}" media="(prefers-color-scheme: light)">`
         *
         * https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
         * https://vike.dev/document
         */
        light: string
      }
}
