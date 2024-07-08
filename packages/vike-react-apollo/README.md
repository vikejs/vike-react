<!-- WARNING: keep links absolute in this file so they work on NPM too -->

[<img src="https://vike.dev/vike-readme.svg" align="right" height="90">](https://vike.dev)
[![npm version](https://img.shields.io/npm/v/vike-react-apollo)](https://www.npmjs.com/package/vike-react-apollo)

# `vike-react-apollo`

Enables your React components to fetch data using [Apollo GraphQL](https://www.apollographql.com/docs/react/).

> [!NOTE]
> You also get [progressive rendering](https://vike.dev/streaming#progressive-rendering), fallback upon loading and/or error, and [caching](https://www.apollographql.com/docs/react/caching/cache-configuration).

[Installation](#installation)  
[Basic usage](#basic-usage)  
[`withFallback()`](#withfallback)  
[How it works](#how-it-works)  


## Installation

1. `npm install @apollo/client @apollo/client-react-streaming graphql vike-react-apollo`
2. Extend `+config.js`:
   ```js
   // pages/+config.js

   import vikeReact from 'vike-react/config'
   import vikeReactApollo from 'vike-react-apollo/config'

   export default {
     // ...
     extends: [vikeReact, vikeReactApollo]
   }
   ```
3. Create `+ApolloClient.js`:
   ```js
   // +ApolloClient.js

   import { ApolloClient, InMemoryCache } from '@apollo/client-react-streaming'

   export default (pageContext: PageContext) =>
      new ApolloClient({
        uri: 'https://countries.trevorblades.com',
        cache: new InMemoryCache()
      })
   ```

> [!NOTE]
> The `vike-react-apollo` extension requires [`vike-react`](https://vike.dev/vike-react).


## Basic usage

```jsx
// Countries.jsx

import { useSuspenseQuery, gql } from '@apollo/client/index.js'

const Countries = () => {
  const { data } = useSuspenseQuery(gql`
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
> Even though `useSuspenseQuery()` is imported from `@apollo/client`, you still need to install `vike-react-apollo` for it to work.


## `withFallback()`

You can define a loading and/or error fallback by using `withFallback()`.

```js
withFallback(Component, Loading) // Define loading fallback
withFallback(Component, Loading, Error) // Define loading and error fallback
withFallback(Component, undefined, Error) // Define error fallback
```

```jsx
// Country.jsx

import { useSuspenseQuery, gql } from '@apollo/client/index.js'
import { withFallback } from 'vike-react-apollo'

const Country = withFallback(
  ({ code }) => {
    const { data } = useSuspenseQuery(
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
  ({ code }) => <div>Loading country {code}</div>,
  ({ code, retry }) => (
    <div>
      Failed to load country {code}
      <button onClick={() => retry()}>Retry</button>
    </div>
  )
)
```

**`+LoadingComponent`**

If you skip the `Loading` parameter, then a default loading component is used.

You can change this default by setting `LoadingComponent`:

```jsx
// +LoadingComponent.jsx

export default function LoadingComponent() {
  return <div>My default loading component</div>
}
```

**`+Loading`**

If you directly use `useSuspenseQuery()`, then the component doesn't have a loading fallback (technically speaking it isn't wrapped with a [`<Suspense>` boundary](https://react.dev/reference/react/Suspense)) and, instead, you can define a loading fallback on a layout- / page-level by setting `Loading`:

```jsx
// +Loading.jsx

export default function Loading() {
  return <div>My layout-level / page-level loading component</div>
}
```

> [!NOTE]
> You can also set an `Error` fallback without a loading fallback by using `withFallback()` and setting its `Layout` parameter to `false`:
> ```js
> withFallback(Component, false, Error)`
> ```


## How it works

Upon SSR, the component is rendered to HTML and its data loaded on the server-side. On the client side, the component is merely [hydrated](https://vike.dev/hydration).

Upon page navigation (and rendering the first page if [SSR is disabled](https://vike.dev/ssr)), the component is rendered and its data loaded on the client-side.

> [!NOTE]
> With `vike-react-apollo` you fetch data on a component-level instead of using Vike's [`data()` hook](https://vike.dev/data) which fetches data on a page-level.

> [!NOTE]
> Behind the scenes `vike-react-apollo` integrates Apollo GraphQL into [the HTML stream](https://github.com/brillout/react-streaming#readme).
