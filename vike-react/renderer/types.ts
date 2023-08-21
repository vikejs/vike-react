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
import type { AdditionalData, Config } from './+config'
import type { ReactElement } from 'react'

// type Component = (props: Record<string, unknown>) => ReactElement
type Component = (props: any) => ReactElement

type Page = (pageProps: PageProps) => ReactElement
type PageProps = Record<string, unknown>
type WrapperComponent = ({ children }: { children: any }) => ReactElement

export type PageContextCommon = {
  Page: Page

  // Properties of the page's root React component.
  pageProps?: PageProps

  // Additional data fetched by the page's onBeforeRender() hook.
  additionalData?: AdditionalData

  config: {
    Layout?: WrapperComponent
    Wrapper?: WrapperComponent
  }
}

type PageContextServer = PageContextBuiltIn<Page> &
  PageContextCommon & {
    config: Config
  }
type PageContextClient = PageContextBuiltInClient<Page> & PageContextCommon
type PageContext = PageContextClient | PageContextServer
