import type { Config } from 'vike/types'
import type _ from 'vike-react/config' // Needed for declaration merging of Config
import type { ApolloClientOptions } from './types.js'

export default {
  name: 'vike-react-apollo',
  require: {
    'vike-react': '>=0.4.13'
  },
  Wrapper: 'import:vike-react-apollo/renderer/Wrapper:default',
  streamIsRequired: true,
  meta: {
    ApolloConfig: {
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
      ApolloConfig?: (pageContext: PageContext) => ApolloClientOptions
    }
  }
}
