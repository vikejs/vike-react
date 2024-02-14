import type { QueryClientConfig } from '@tanstack/react-query'
import type { ReactNode } from 'react'

export default {
  // @ts-ignore Remove this ts-ignore once Vike's new version is released.
  name: 'vike-react-query',
  queryClientConfig: undefined,
  VikeReactQueryWrapper: 'import:vike-react-query/renderer/VikeReactQueryWrapper:default',
  FallbackErrorBoundary: 'import:vike-react-query/renderer/FallbackErrorBoundary:default',
  stream: true,
  meta: {
    queryClientConfig: {
      env: {
        server: true,
        client: true
      }
    },
    FallbackErrorBoundary: {
      env: {
        server: true,
        client: true
      }
    }
  }
}

declare global {
  namespace VikePackages {
    interface ConfigVikeReact {
      queryClientConfig: QueryClientConfig
      FallbackErrorBoundary: (props: { children: ReactNode }) => ReactNode
    }
  }
}
