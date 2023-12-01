import type { QueryClientConfig } from '@tanstack/react-query'
import type { ReactNode } from 'react'

export default {
  queryClientConfig: undefined,
  __internalOnBeforeRenderAll: 'import:vike-react-query/renderer/__internalOnBeforeRenderAll:default',
  FallbackErrorBoundary: 'import:vike-react-query/renderer/FallbackErrorBoundary:default',
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