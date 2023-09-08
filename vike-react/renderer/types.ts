export type { PageContextServer }
export type { PageContextClient }
export type { PageContext }
export type { PageProps }
export type { Page }
export type { Component }

import type {
  PageContextBuiltInServer,
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient
} from 'vite-plugin-ssr/types'
import type { ReactElement } from 'react'

// type Component = (props: Record<string, unknown>) => ReactElement
type Component = (props: any) => ReactElement

type Page = (pageProps: PageProps) => ReactElement
type PageProps = Record<string, unknown>

export type PageContextCommon = {
  Page: Page
  pageProps?: PageProps
}

type PageContextServer = PageContextBuiltInServer<Page> & PageContextCommon
type PageContextClient = PageContextBuiltInClient<Page> & PageContextCommon
type PageContext = PageContextClient | PageContextServer
