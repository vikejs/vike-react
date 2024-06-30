import { type ApolloClientOptions, InMemoryCache } from '@apollo/client/index.js'
import type { PageContext } from 'vike/types'

export default (pageContext: PageContext) =>
  ({
    uri: 'https://spacex-production.up.railway.app/',
    cache: new InMemoryCache()
  }) satisfies ApolloClientOptions<any>
