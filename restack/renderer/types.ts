export type { PageContextServer }
export type { PageContextClient }
export type { PageContext }
export type { PageProps }
export type { Page }

import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client/router'

type Page = (pageProps: PageProps) => React.ReactElement
type PageProps = Record<string, unknown>
type WrapperComponent = ({ children }: { children: any }) => React.ReactElement

export type PageContextCommon = {
  Page: Page
  pageProps?: PageProps
  exports: {
    Layout?: WrapperComponent
    Wrapper?: WrapperComponent
  }
}

type PageContextServer = PageContextBuiltIn<Page> &
  PageContextCommon & {
    exports: {
      Head?: () => React.ReactElement
    }
  }
type PageContextClient = PageContextBuiltInClient<Page> & PageContextCommon
type PageContext = PageContextClient | PageContextServer
