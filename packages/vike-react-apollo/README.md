<!-- WARNING: keep links absolute in this file so they work on NPM too -->

[![npm version](https://img.shields.io/npm/v/vike-react-apollo)](https://www.npmjs.com/package/vike-react-apollo)

# `vike-react-apollo`

Enables your React components to fetch data using [Apollo GraphQL](https://www.apollographql.com).

Powered by HTML streaming with [`react-streaming`](https://github.com/brillout/react-streaming#readme).

> [!NOTE]
> Features:
> - [Progressive Rendering](https://vike.dev/streaming#progressive-rendering)
> - [SSR benefits](https://github.com/brillout/react-streaming#ssr)
> - Fallback upon loading and/or error
> - [Caching](https://www.apollographql.com/docs/react/caching/cache-configuration)

[Installation](#installation)  
[Basic usage](#basic-usage)  
[Example](#example)  
[`withFallback()`](#withfallback)  
[`<head>` tags](#head-tags)  
[Error Handling](#error-handling)  
[How it works](#how-it-works)  
[Version history](#version-history)  
[See also](#see-also)  

<br/>

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

<br/>

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
> Even though [`useSuspenseQuery()`](https://www.apollographql.com/docs/react/api/react/hooks/#usesuspensequery) is imported from `@apollo/client`, you need to install `vike-react-apollo` for it to work. (The `useSuspenseQuery()` hook requires an [HTML stream](https://vike.dev/streaming) integration.)

Benefits:
 - Data is fetched at the component level (unlike [`+data`](https://vike.dev/data), which fetches at the page level).
 - The rest of the page is eagerly rendered while the component waits for its data (see [Progressive Rendering](https://vike.dev/streaming#progressive-rendering)).
 - All the niceties of Apollo GraphQL.

You can completely stop using Vike's [`+data` hook](https://vike.dev/data) — or use both: `+data` for some pages, and `vike-react-apollo` for others.

<br/>

## Example

See [examples/apollo/](https://github.com/vikejs/vike-react/tree/main/examples/apollo).

<br/>

## `withFallback()`

```js
withFallback(Component) // Use default loading fallback (see +Loading)
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
  // The props `retry` and `error` are provided by vike-react-apollo
  // Other props, such as `code`, are provied by the parent component
  ({ code, retry, error }) => (
    <div>
      Failed to load country {code}
      <button onClick={() => retry()}>Retry</button>
    </div>
  )
)
```

**`+Loading`**

If you skip the `Loading` parameter, then a default loading component (provided by `vike-react`) is used. You can create a custom default loading component:

```jsx
// pages/+Loading.jsx

export default { component: LoadingComponent }

function LoadingComponent() {
  // Applies on a component-level
  return <div>Loading...</div>
}
```

Instead of adding a loading fallback to the component, you can set a loading fallback to the page and layouts:

```jsx
// pages/+Loading.jsx

export default { layout: LoadingLayout }

function LoadingLayout() {
  // Applies to the page and all layouts
  return <div>Loading...</div>
}
```

> [!NOTE]
> The `+Loading.layout` setting is optional and only relevant when using `useSuspenseQuery()` without `withFallback()` or `withFallback(Component, false)`.
> ```js
> withFallback(Component, false) // Don't set any loading fallback
> withFallback(Component, undefined) // Use default loading fallback
> ```

**Manual `<Suspense>` boundary**

Technically speaking:
- `withFallback()` wraps the component inside a [`<Suspense>` boundary](https://react.dev/reference/react/Suspense).
- `+Loading.layout` adds a `<Suspense>` boundary to the [`<Page>` component](https://vike.dev/Page) as well as to all [`<Layout>` components](https://vike.dev/Layout).

You can also manually add a `<Suspense>` boundary at any arbitrary position:

```js
import { Suspense } from 'react'

function SomePageSection() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SomeDataFetchingComponent />
      <SomeOtherDataFetchingComponent />
    </Suspense>
  )
}
```

<br/>

## `<head>` tags

To set tags such as `<title>` and `<meta name="description">` based on fetched data, you can use [`<Config>`, `<Head>`, and `useConfig()`](https://vike.dev/useConfig).

```js
import { useSuspenseQuery } from '@tanstack/react-query'
import { Config } from 'vike-react/Config'
import { Head } from 'vike-react/Head'

function Movies() {
  const query = useSuspenseQuery(gql`
    {
      movies {
        title
      }
    }
  `)
  const movies = query.data
  return (
    <Config title={`${movies.length} Star Wars Movies`} />
    <Head>
      <meta name="description" content={`All ${movies.length} movies from the Star Wars franchise.`} />
    </Head>
    <ul>{
      movies.map(({ title }) => (
        <li>{title}</li>
      ))
    }</ul>
  )
}
```

<br/>

## Error Handling

From a UI perspective, the classic approach to handling errors is the following.
- **Show a 404 page**, for example `<h1>404 Page Not Found</h1><p>This page could not found.</p>`.
- **Show an error page**, for example `<h1>500 Internal Server Error</h1><p>Something went wrong.</p>`.
- **Redirect the user**, for example redirecting the user to `/publish-movie` upon `/movie/some-fake-movie-title` because there isn't any movie `some-fake-movie-title`.

But because `vike-react-apollo` leverages [HTML streaming](https://vike.dev/streaming) these approaches don't work (well) and we recommend the following instead.
- **Show a not-found component**, for example `<p>No movie <code>some-fake-movie-title</code> found.</p>`.
- **Show an error component**, for example `<p>Something went wrong (couldn't fetch movie), please try again later.</p>`.
- **Show a link** (instead of redirecting the user), for example `<p>No movie <code>some-fake-movie-title</code> found. You can <a href="/publish-movie">publish a new movie</a>.</p>`.

See: [`withFallback()`](#withfallback)

> [!NOTE]
> HTML chunks that are already streamed to the user cannot be reverted and that's why page-level redirection ([`throw redirect`](https://vike.dev/redirect)) and rewrite ([`throw render()`](https://vike.dev/render)) don't work (well).
>
> Also it isn't idiomatic: the whole idea of collocating data-fetching with the UI component is to think in terms of the component in isolation rather than in terms of the page.

<br/>

## How it works

On the server side (during SSR), the component is rendered to HTML and its data is loaded. On the client side, the component is just [hydrated](https://vike.dev/hydration): the data fetched on the server is passed to the client and reused.

Upon page navigation (and rendering the first page if [SSR is disabled](https://vike.dev/ssr)), the component is rendered and its data loaded on the client-side.

> [!NOTE]
> Behind the scenes `vike-react-apollo` integrates Apollo GraphQL into [`react-streaming`](https://github.com/brillout/react-streaming#readme).

<br/>

## Version history

See [CHANGELOG.md](https://github.com/vikejs/vike-react/blob/main/packages/vike-react-apollo/CHANGELOG.md).

<br/>

## See also

- [Vike Docs > Apollo GraphQL](https://vike.dev/apollo-graphql)
- [Vike Docs > Data Fetching](https://vike.dev/data-fetching)
- [Apollo GraphQL > useSuspenseQuery](https://www.apollographql.com/docs/react/api/react/hooks/#usesuspensequery)
- [Apollo GraphQL > Suspense](https://www.apollographql.com/docs/react/data/suspense/)
- [React > `<Suspense>`](https://react.dev/reference/react/Suspense)
