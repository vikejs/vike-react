import { ApolloClient, InMemoryCache } from '@apollo/client-react-streaming'
import type { PageContext } from 'vike/types'

// Apollo GraphQL Client with artificial delay: https://gist.github.com/brillout/7d7db0fd6ce55b3b5e8f7ec893eeda01
export default (pageContext: PageContext) =>
  new ApolloClient({
    uri: 'https://countries.trevorblades.com',
    cache: new InMemoryCache(),
  })
