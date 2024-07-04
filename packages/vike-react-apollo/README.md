<!-- WARNING: keep links absolute in this file so they work on NPM too -->

[<img src="https://vike.dev/vike-readme.svg" align="right" height="90">](https://vike.dev)
[![npm version](https://img.shields.io/npm/v/vike-react-apollo)](https://www.npmjs.com/package/vike-react-apollo)

# `vike-react-apollo`

Enable your React components to fetch data using [Apollo GraphQL](https://www.apollographql.com/docs/react/).

> [!NOTE]
> With `vike-react-apollo` you fetch data on a component-level, instead using [Vike's `data()` hook](https://vike.dev/data) which fetches data on a page-level.

You also get:
 - [Progressive rendering](https://vike.dev/streaming#progressive-rendering)
 - [Fallback upon loading and/or error](#withfallback)
 - [Caching](https://www.apollographql.com/docs/react/caching/cache-configuration)

See [example](https://github.com/vikejs/vike-react/tree/main/examples/apollo).


## Installation

1. `npm install @apollo/client @apollo/client-react-streaming graphql vike-react-apollo`
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
3. Create `+ApolloClient.ts`:
   ```ts
    // /pages/+ApolloClient.ts
    import { InMemoryCache } from '@apollo/client-react-streaming'
    import type { ApolloClientOptions } from 'vike-react-apollo/types'
    import type { PageContext } from 'vike/types'

    export default (pageContext: PageContext) =>
    ({
        uri: 'https://countries.trevorblades.com',
        cache: new InMemoryCache()
    }) satisfies ApolloClientOptions
   ```

> [!NOTE]
> The `vike-react-apollo` [extension](https://vike.dev/extensions) requires [`vike-react`](https://vike.dev/vike-react).


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

> [!NOTE]
> Upon SSR, the component is rendered to HTML and its data loaded on the server side, while on the client side it's merely [hydrated](https://vike.dev/hydration).
>
> Upon page navigation, the component is rendered and its data loaded on the client-side.

> [!NOTE]
> Even though `useSuspenseQuery()` is imported from `@apollo/client`, you still need to [install `vike-react-apollo`](#installation) for it to work. (Behind the scenes `vike-react-apollo` integrates Apollo GraphQL with [the SSR stream](react-streaming#readme).)


## `withFallback()`

You can define a loading and/or error fallback by using `withFallback()`.

```tsx
// Country.tsx
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