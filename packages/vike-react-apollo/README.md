<!-- WARNING: keep links absolute in this file so they work on NPM too -->

[<img src="https://vike.dev/vike-readme.svg" align="right" height="90">](https://vike.dev)
[![npm version](https://img.shields.io/npm/v/vike-react-apollo)](https://www.npmjs.com/package/vike-react-apollo)

# `vike-react-apollo`

[Apollo GraphQL](https://www.apollographql.com/docs/react/) integration for [vike-react](https://github.com/vikejs/vike-react/tree/main/packages/vike-react).

`vike-react-apollo` enables you to create components that can fetch data.

You can use it instead of [Vike's `data()` hook](https://vike.dev/data): with `vike-react-apollo` you fetch data at component-level instead of page-level.

You also get:
 - [Progressive rendering](https://vike.dev/streaming#progressive-rendering) for a significant (perceived) increase in page speed.
 - Fallback component upon loading/error. (See [`withFallback()`](#withfallback).)
 - Caching. ([Read more](https://www.apollographql.com/docs/react/caching/cache-configuration).)

See [example](https://github.com/vikejs/vike-react/tree/main/examples/apollo).

> [!NOTE]  
> `vike-react-apollo` leverages [React 18's suspense streaming feature](https://github.com/brillout/react-streaming#readme). (Similar to [Next.js Loading UI and Streaming](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming), but on a component level.)


## Installation

1. `pnpm i @apollo/client @apollo/client-react-streaming graphql`
2. Extend `+config.ts`:
   ```ts
   // /pages/+config.ts

   import type { Config } from 'vike/types'
   import vikeReact from 'vike-react/config'
   import vikeReactApollo from 'vike-react-apollo/config'

   export default {
     ...
     extends: [vikeReact, vikeReactApollo]
   } satisfies Config
   ```
3. Create `+ApolloConfig.ts`:
   ```ts
    // /pages/+ApolloConfig.ts
    import { InMemoryCache } from '@apollo/client-react-streaming'
    import type { ApolloClientOptions } from 'vike-react-apollo/types'
    import type { PageContext } from 'vike/types'

    export default (pageContext: PageContext) =>
    ({
        uri: 'https://countries.trevorblades.com',
        cache: new InMemoryCache()
    }) satisfies ApolloClientOptions
   ```


## Basic usage

```tsx
import { useSuspenseQuery, gql } from '@apollo/client/index.js'

const Countries = () => {
  const { data } = useSuspenseQuery<{ countries: { code: string; name: string }[] }>(gql`
    {
      countries {
        code
        name
      }
    }
  `)

  return (
    <ul>
      {data.countries.map((country) => (
        <li key={country.code}>{country.name}</li>
      ))}
    </ul>
  )
}
```


## `withFallback()`

Using `withFallback()`, you can define a loading and/or an error fallback component:
 - While the query is loading, the `Loading` component is rendered.
 - When the query is completed and the data is available, the main component is rendered.
 - If there is an error during loading or rendering, the `Error` component is rendered.

> [!NOTE]  
> If you use SSR, the main component is rendered to HTML, and merely hydrated on the client-side: the data is re-used (instead of being fetched a second time).


```tsx
import { useSuspenseQuery, gql } from '@apollo/client/index.js'
import { withFallback } from 'vike-react-apollo'

const Country = withFallback(
  ({ code }: { code: string }) => {
    const { data } = useSuspenseQuery<{ country: { name: string } }>(
      gql`
        query Country($code: String!) {
          country(code: $code) {
            name
          }
        }
      `,
      {
        variables: {
          code
        }
      }
    )

    return (
      <div>
        Name: <b>{data.country.name}</b>
      </div>
    )
  },
  {
    Loading: ({ code }) => <div>Loading country {code}</div>,
    Error: ({ code, retry }) => (
      <div>
        Failed to load country {code}
        <button onClick={() => retry()}>Retry</button>
      </div>
    )
  }
)
```