import { InMemoryCache } from '@apollo/client-react-streaming'
import type { ApolloClientOptions } from 'vike-react-apollo/types'
import type { PageContext } from 'vike/types'

export default (pageContext: PageContext) =>
  ({
    uri: 'https://countries.trevorblades.com',
    cache: new InMemoryCache()
  }) satisfies ApolloClientOptions
