export type { ApolloClientOptions }

import type {
  ApolloClientOptions as OriginalApolloClientOptions,
  NormalizedCacheObject,
  InMemoryCache
} from '@apollo/client'

interface ApolloClientOptions extends Omit<OriginalApolloClientOptions<NormalizedCacheObject>, 'cache'> {
  cache: InMemoryCache
}
