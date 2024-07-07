import { ApolloClient, InMemoryCache } from '@apollo/client-react-streaming'
import type { PageContext } from 'vike/types'

export default (pageContext: PageContext) =>
  new ApolloClient({
    uri: 'https://countries.trevorblades.com',
    cache: new InMemoryCache()
  })
