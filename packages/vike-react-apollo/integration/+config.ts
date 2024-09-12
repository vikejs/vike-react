export { config as default }

import type { Config } from 'vike/types'
import 'vike-react/config' // Needed for declaration merging of Config
import type { ApolloClient } from '@apollo/client-react-streaming'

const config = {
  name: 'vike-react-apollo',
  require: {
    'vike-react': '>=0.4.18',
  },
  Wrapper: 'import:vike-react-apollo/__internal/integration/Wrapper:default',
  streamIsRequired: true,
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
