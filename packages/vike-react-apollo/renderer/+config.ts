import type { Config, ImportString } from 'vike/types'
import type _ from 'vike-react/config' // Needed for declaration merging of Config
import type { ApolloClient } from '@apollo/client-react-streaming'

export default {
  name: 'vike-react-apollo',
  require: {
    'vike-react': '>=0.4.13'
  },
  Wrapper: 'import:vike-react-apollo/renderer/Wrapper:default',
  LoadingComponent: 'import:vike-react-apollo/renderer/LoadingComponent:default',
  streamIsRequired: true,
  meta: {
    ApolloClient: {
      env: {
        server: true,
        client: true
      }
    },
    Loading: {
      env: { server: true, client: true }
    },
    LoadingComponent: {
      env: { server: true, client: true }
    }
  }
} satisfies Config

declare global {
  namespace Vike {
    interface Config {
      ApolloClient?: (pageContext: PageContext) => ApolloClient
      Loading?: () => React.ReactNode
      LoadingComponent?: (() => React.ReactNode) | ImportString
    }
  }
}
