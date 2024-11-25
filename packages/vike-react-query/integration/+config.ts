export { config as default }

import type { QueryClientConfig } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import type { Config, ImportString } from 'vike/types'
import 'vike-react/config' // Needed for declaration merging of Config

const config = {
  name: 'vike-react-query',
  require: {
    'vike-react': '>=0.4.13',
  },
  queryClientConfig: undefined,
  Wrapper: 'import:vike-react-query/__internal/integration/Wrapper:Wrapper',
  FallbackErrorBoundary: 'import:vike-react-query/__internal/integration/FallbackErrorBoundary:FallbackErrorBoundary',
  streamIsRequired: true,
  meta: {
    queryClientConfig: {
      env: {
        server: true,
        client: true,
      },
    },
    FallbackErrorBoundary: {
      env: {
        server: true,
        client: true,
      },
    },
  },
} satisfies Config

declare global {
  namespace Vike {
    interface Config {
      queryClientConfig?: QueryClientConfig | ((pageContext: PageContext) => QueryClientConfig)
      FallbackErrorBoundary?: ((props: { children: ReactNode }) => ReactNode) | ImportString
    }
  }
}
