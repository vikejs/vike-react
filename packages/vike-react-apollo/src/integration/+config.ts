export { config as default }

import type { Config } from 'vike/types'
import type { ApolloClient } from '@apollo/client-react-streaming'
import 'vike-react/config' // Needed for merging vike-react's Vike.Config such as +stream

const config = {
  name: 'vike-react-apollo',
  require: {
    'vike-react': '>=0.6.4',
  },
  Wrapper: 'import:vike-react-apollo/__internal/integration/Wrapper:Wrapper',
  stream: { require: true },
  meta: {
    ApolloClient: {
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
      ApolloClient?: (pageContext: PageContext) => ApolloClient
    }
  }
}
