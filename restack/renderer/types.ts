export type { PageContextServer }
export type { PageContextClient }
export type { PageContext }
export type { PageProps }
export type { Page }
export type { Component }

import type {
  PageContextBuiltIn,
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient
} from 'vite-plugin-ssr/types'
import type { RestackConfig } from './+config'
import type { ReactElement } from 'react'

// type Component = (props: Record<string, unknown>) => ReactElement
type Component = (props: any) => ReactElement

type Page = (pageProps: PageProps) => ReactElement
type PageProps = Record<string, unknown>
type WrapperComponent = ({ children }: { children: any }) => ReactElement

export type PageContextCommon = {
  Page: Page
  pageProps?: PageProps
  config: {
    Layout?: WrapperComponent
    Wrapper?: WrapperComponent
  }
}

type PageContextServer = PageContextBuiltIn<Page> &
  PageContextCommon & {
    config: Partial<RestackConfig>
  }
type PageContextClient = PageContextBuiltInClient<Page> & PageContextCommon
type PageContext = PageContextClient | PageContextServer
