export type { ApolloClientOptions }

import type { ApolloClientOptions as OriginalApolloClientOptions, NormalizedCacheObject } from '@apollo/client'
import type { InMemoryCache } from '@apollo/client-react-streaming'

interface ApolloClientOptions extends Omit<OriginalApolloClientOptions<NormalizedCacheObject>, 'cache'> {
  cache: InMemoryCache
}
