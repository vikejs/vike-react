<!-- WARNING: keep links absolute in this file so they work on NPM too -->

[![npm version](https://img.shields.io/npm/v/vike-react-query)](https://www.npmjs.com/package/vike-react-query)

# `vike-react-query`

Enables your React components to fetch data using [TanStack Query](https://tanstack.com/query/latest).

Powered by HTML streaming with [`react-streaming`](https://github.com/brillout/react-streaming#readme).

> [!NOTE]
> Features:
> - [Progressive Rendering](https://vike.dev/streaming#progressive-rendering)
> - [SSR benefits](https://github.com/brillout/react-streaming#ssr)
> - Fallback upon loading and/or error
> - [Caching](https://tanstack.com/query/latest/docs/framework/react/reference/useSuspenseQuery)

[Installation](#installation)  
[Basic usage](#basic-usage)  
[Example](#example)  
[`withFallback()`](#withfallback)  
[`<head>` tags](#head-tags)  
[Error Handling](#error-handling)  
[Settings](#settings)  
[Usage with Telefunc](#usage-with-telefunc)  
[How it works](#how-it-works)  
[Version history](#version-history)  
[See also](#see-also)  

<br/>

## Installation

1. `npm install @tanstack/react-query vike-react-query`
2. Extend `+config.js`:
   ```js
   // pages/+config.js

   import vikeReact from 'vike-react/config'
   import vikeReactQuery from 'vike-react-query/config'

   export default {
     // ...
     extends: [vikeReact, vikeReactQuery]
   }
   ```

> [!NOTE]
> The `vike-react-query` extension requires [`vike-react`](https://vike.dev/vike-react).

<br/>

## Basic usage

```jsx
import { useSuspenseQuery } from '@tanstack/react-query'

const Movie = ({ id }) => {
  const result = useSuspenseQuery({
    queryKey: ['movie', id],
    queryFn: () =>
      fetch(`https://brillout.github.io/star-wars/api/films/${id}.json`)
      .then((res) => res.json())
  })

  const { title } = result.data

  return (
    <div>
      Title: <b>{title}</b>
    </div>
  )
}
```

> [!NOTE]
> Even though [`useSuspenseQuery()`](https://tanstack.com/query/latest/docs/framework/react/reference/useSuspenseQuery) is imported from `@tanstack/react-query`, you need to install `vike-react-query` for it to work. (The `useSuspenseQuery()` hook requires an [HTML stream](https://vike.dev/streaming) integration.)

Benefits:
 - Data is fetched at the component level (unlike [`+data`](https://vike.dev/data), which fetches at the page level).
 - The rest of the page is eagerly rendered while the component waits for its data (see [Progressive Rendering](https://vike.dev/streaming#progressive-rendering)).
 - All the niceties of TanStack Query.

You can completely stop using Vike's [`+data` hook](https://vike.dev/data) — or use both: `+data` for some pages, and `vike-react-query` for others.

<br/>

## Example

See [examples/react-query/](https://github.com/vikejs/vike-react/tree/main/examples/react-query).

<br/>

## `withFallback()`

```js
withFallback(Component) // Use default loading fallback (see +Loading)
withFallback(Component, Loading) // Define loading fallback
withFallback(Component, Loading, Error) // Define loading and error fallback
withFallback(Component, undefined, Error) // Define error fallback
```

```tsx
// Movie.tsx

import { useSuspenseQuery } from '@tanstack/react-query'
import { withFallback } from 'vike-react-query'

const Movie = withFallback(
  ({ id }: { id: string }) => {
    const result = useSuspenseQuery({
      queryKey: ['movie', id],
      queryFn: () =>
        fetch(`https://brillout.github.io/star-wars/api/films/${id}.json`)
        .then((res) => res.json())
    })

    const { title } = result.data

    return (
      <div>
        Title: <b>{title}</b>
      </div>
    )
  },
  ({ id }) => <div>Loading movie {id}</div>,
  // The props `retry` and `error` are provided by vike-react-query
  // Other props, such as `code`, are provied by the parent component
  ({ id, retry, error }) => (
    <div>
      Failed to load movie {id}
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
  const query = useSuspenseQuery({
    queryKey: ['movies'],
    queryFn: () => fetch('https://star-wars.brillout.com/api/films.json')
  })
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

But because `vike-react-query` leverages [HTML streaming](https://vike.dev/streaming) these approaches don't work (well) and we recommend the following instead.
- **Show a not-found component**, for example `<p>No movie <code>some-fake-movie-title</code> found.</p>`.
- **Show an error component**, for example `<p>Something went wrong (couldn't fetch movie), please try again later.</p>`.
- **Show a link** (instead of redirecting the user), for example `<p>No movie <code>some-fake-movie-title</code> found. You can <a href="/publish-movie">publish a new movie</a>.</p>`.

See: [`withFallback()`](#withfallback)

> [!NOTE]
> HTML chunks that are already streamed to the user cannot be reverted and that's why page-level redirection ([`throw redirect`](https://vike.dev/redirect)) and rewrite ([`throw render()`](https://vike.dev/render)) don't work (well).
>
> Also it isn't idiomatic: the whole idea of collocating data-fetching with the UI component is to think in terms of the component in isolation rather than in terms of the page.

<br/>

## Settings

You can modify the defaults defined by [`QueryClient`](https://tanstack.com/query/latest/docs/reference/QueryClient).

```js
// +config.js

export default {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000
      }
    }
  }
}
```

You can access [`pageContext`](https://vike.dev/pageContext):

```js
// +queryClientConfig.js

export default (pageContext) => ({
  defaultOptions: {
    queries: {
      staleTime: pageContext.data.staleTime,
      retry: pageContext.routeParams.userId ? true : false
    }
  }
})
```

> [!NOTE]
> You can apply settings to all pages, a group of pages, or only one page. See [Vike Docs > Config > Inheritance](https://vike.dev/config#inheritance).

<br/>

## Usage with Telefunc

You can use `vike-react-query` with [Telefunc](https://telefunc.com).

> [!NOTE]
> By using `vike-react-query` with Telefunc, you combine [RPC](https://vike.dev/RPC) with all TanStack Query features.

With Telefunc, the query function always runs on the server.

**Query example**

```tsx
// movie.telefunc.ts

export async function getMovie(id: string) {
  const movie = await prisma.movie.findUnique({ where: id })
  return movie;
}
```
```tsx
// movie.tsx

import { useSuspenseQuery } from '@tanstack/react-query'
import { withFallback } from 'vike-react-query'
import { getMovie } from './movie.telefunc'

const Movie = withFallback(
  ({ id }: { id: string }) => {
    const query = useSuspenseQuery({
      queryKey: ['movie', id],
      queryFn: () => getMovie(id)
    })

    const { title } = query.data

    return (
      <div>
        Title: <b>{title}</b>
      </div>
    )
  },
  ({ id }) => <div>Loading movie {id}</div>,
  ({ id, retry }) => (
    <div>
      Failed to load movie {id}
      <button onClick={() => retry()}>Retry</button>
    </div>
  )
)
```

**Mutation example**

```tsx
// movie.telefunc.ts

export async function createMovie({ title }: { title: string }) {
  const movie = await prisma.movie.create({ data: { title } })
  return movie
}
```
```tsx
// movie.tsx

import { useMutation } from '@tanstack/react-query'
import { createMovie } from './movie.telefunc'

const CreateMovie = () => {
  const ref = useRef<HTMLInputElement>(null)
  const mutation = useMutation({
    mutationFn: createMovie
  })

  const onCreate = () => {
    const title = ref.current?.value || 'No title'
    mutation.mutate({ title })
  }

  return (
    <div>
      <input type="text" ref={ref} />
      <button onClick={onCreate}>Create movie</button>
      {mutation.isPending && 'Creating movie..'}
      {mutation.isSuccess && 'Created movie ' + mutation.data.title}
      {mutation.isError && 'Error while creating the movie'}
    </div>
  )
}
```

**Putting it together**

```tsx
// movie.telefunc.ts

export async function getMovies() {
  const movies = await prisma.movie.findMany()
  return movies;
}
export async function createMovie({ title }: { title: string }) {
  const movie = await prisma.movie.create({ data: { title } })
  return movie
}
```
```tsx
// movie.tsx

import { useSuspenseQuery, useMutation } from '@tanstack/react-query'
import { withFallback } from 'vike-react-query'
import { getMovies, createMovie } from './movie.telefunc'

const Movies = withFallback(
  () => {
    const queryClient = useQueryClient()
    const query = useSuspenseQuery({
      queryKey: ['movies'],
      queryFn: () => getMovies()
    })
    const mutation = useMutation({
      mutationFn: createMovie,
      onSuccess() {
        query.invalidateQueries({ queryKey: ['movies'] })
        // or query.refetch()
      }
    })

    const ref = useRef<HTMLInputElement>(null)
    const onCreate = () => {
      const title = ref.current?.value || 'No title'
      mutation.mutate({ title })
    }

    return (
      <div>
        {query.data.map((movie) => (
          <div>Title: {movie.title}</div>
        ))}

        <div>
          <input type="text" ref={ref} />
          <button onClick={onCreate}>Create movie</button>
          {mutation.isPending && 'Creating movie..'}
          {mutation.isSuccess && 'Created movie' + mutation.data.title}
          {mutation.isError && 'Error while creating the movie'}
        </div>
      </div>
    )
  },
  <div>Loading movies</div>,
  ({ retry }) => (
    <div>
      Error while loading movies
      <button onClick={() => retry()}>Retry</button>
    </div>
  )
)
```

<br/>

## How it works

On the server side (during SSR), the component is rendered to HTML and its data is loaded. On the client side, the component is just [hydrated](https://vike.dev/hydration): the data fetched on the server is passed to the client and reused.

Upon page navigation (and rendering the first page if [SSR is disabled](https://vike.dev/ssr)), the component is rendered and its data loaded on the client-side.

> [!NOTE]
> Behind the scenes `vike-react-query` integrates TanStack Query into [`react-streaming`](https://github.com/brillout/react-streaming#readme).

<br/>

## Version history

See [CHANGELOG.md](https://github.com/vikejs/vike-react/blob/main/packages/vike-react-query/CHANGELOG.md).

<br/>

## See also

- [Vike Docs > TanStack Query](https://vike.dev/tanstack-query)
- [Vike Docs > Data Fetching](https://vike.dev/data-fetching)
- [TanStack Query > useSuspenseQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useSuspenseQuery)
- [React > `<Suspense>`](https://react.dev/reference/react/Suspense)
