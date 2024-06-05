import type { QueryClientConfig } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import type { Config, ImportString } from 'vike/types'
import type _ from 'vike-react/config' // Needed for declaration merging of Config

export default {
  name: 'vike-react-query',
  require: {
    'vike-react': '>=0.4.12'
  },
  queryClientConfig: undefined,
  Wrapper: 'import:vike-react-query/renderer/Wrapper:default',
  FallbackErrorBoundary: 'import:vike-react-query/renderer/FallbackErrorBoundary:default',
  streamIsRequired: true,
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
} satisfies Config

declare global {
  namespace Vike {
    interface Config {
      queryClientConfig?: QueryClientConfig
      FallbackErrorBoundary?: ((props: { children: ReactNode }) => ReactNode) | ImportString
    }
  }
}
