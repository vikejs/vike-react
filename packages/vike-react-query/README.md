<!-- WARNING: keep links absolute in this file so they work on NPM too -->

[<img src="https://vike.dev/vike-readme.svg" align="right" height="90">](https://vike.dev)
[![npm version](https://img.shields.io/npm/v/vike-react-query)](https://www.npmjs.com/package/vike-react-query)

# `vike-react-query`

Enable your React components to fetch data using [TanStack Query](https://tanstack.com/query/latest).

> [!NOTE]
> With `vike-react-query` you can fetch data on a component-level, instead using [Vike's `data()` hook](https://vike.dev/data) which fetches data on a page-level.

You also get:
 - [Progressive rendering](https://vike.dev/streaming#progressive-rendering)
 - [Fallback upon loading and/or error](#withfallback)
 - [Caching](https://tanstack.com/query/latest/docs/framework/react/reference/useSuspenseQuery)
 - [Optional usage with Telefunc](#usage-with-telefunc)

See [example](https://github.com/vikejs/vike-react/tree/main/examples/react-query).


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
> The `vike-react-query` [extension](https://vike.dev/extensions) requires [`vike-react`](https://vike.dev/vike-react).


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
> Upon SSR, the component is rendered to HTML and its data loaded on the server side, while on the client side it's merely [hydrated](https://vike.dev/hydration).
>
> Upon page navigation, the component is rendered and its data loaded on the client-side.

> [!NOTE]
> Even though `useSuspenseQuery()` is imported from `@tanstack/react-query`, you still need to [install `vike-react-query`](#installation) for it to work. (Behind the scenes `vike-react-query` integrates TanStack Query with [the SSR stream](react-streaming#readme).)


## `withFallback()`

You can define a loading and/or error fallback by using `withFallback()`.

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
  {
    Loading: ({ id }) => <div>Loading movie {id}</div>,
    Error: ({ id, retry }) => (
      <div>
        Failed to load movie {id}
        <button onClick={() => retry()}>Retry</button>
      </div>
    )
  }
)
```

## Defaults

You can modify the defaults defined by [`QueryClient`](https://tanstack.com/query/latest/docs/reference/QueryClient).

Gloablly, for all components:

```js
// pages/+config.js

// Applies to all pages.

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

For the components of one page:

```js
// pages/product/@id/+config.js

// Applies only to /product/@id/+Page.js (given there is only
// one +Page.js file under the /pages/product/@id directory).

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

For the components of a group of pages:

```js
// pages/admin/+config.js

// Applies to all /pages/admin/**/+Page.js

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


## Usage with Telefunc

You can use `vike-react-query` with [Telefunc](https://telefunc.com).

> [!NOTE]
> By using `vike-react-query` with Telefunc, you combine [RPC](https://vike.dev/RPC) with all TanStack Query features.

With Telefunc, the query function always runs on the server.

#### Query example

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
  {
    Loading: ({ id }) => <div>Loading movie {id}</div>,
    Error: ({ id, retry }) => (
      <div>
        Failed to load movie {id}
        <button onClick={() => retry()}>Retry</button>
      </div>
    )
  }
)
```

#### Mutation example

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

#### Putting it together

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
  {
    Loading: <div>Loading movies</div>,
    Error: ({ retry }) => (
      <div>
        Error while loading movies
        <button onClick={() => retry()}>Retry</button>
      </div>
    )
  }
)
```
