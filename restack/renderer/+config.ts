import type { Config } from 'vite-plugin-ssr/types'
import type { Component } from './types'

export type UserConfig = Partial<RestackConfig & { Page: Component } & Pick<Config, 'route' | 'prerender' | 'isErrorPage' | 'iKnowThePerformanceRisksOfAsyncRouteFunctions'>>

export type RestackConfig = {
  /** React element renderer and appended into &lt;head>&lt;/head> */
  Head: Component
  Layout: Component
  /** &lt;title>${title}&lt;/title> */
  title: string
  /** &lt;meta name="description" content="${description}" /> */
  description: string
  /** &lt;link rel="icon" href="${favicon}" /> */
  favicon: string
  /** &lt;html lang="${lang}">
   *
   *  @default 'en'
   *
   */
  lang: string
}

export default {
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
    }
  }
} satisfies Config
