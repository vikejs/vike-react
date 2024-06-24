<!-- WARNING: keep links absolute in this file so they work on NPM too -->

[<img src="https://vike.dev/vike-readme.svg" align="right" height="90">](https://vike.dev)
[![npm version](https://img.shields.io/npm/v/vike-react-query)](https://www.npmjs.com/package/vike-react-query)

# `vike-react-query`

[TanStack Query](https://tanstack.com/query/latest) integration for [vike-react](https://github.com/vikejs/vike-react/tree/main/packages/vike-react).

`vike-react-query` enables you to create components that can fetch data.

You can use it instead of [Vike's `data()` hook](https://vike.dev/data): with `vike-react-query` you fetch data at component-level instead of page-level.

You also get:
 - [Progressive rendering](https://vike.dev/streaming#progressive-rendering) for a significant (perceived) increase in page speed.
 - Fallback component upon loading/error. (See [`withFallback()`](#withfallback).)
 - Caching. (See [`useSuspenseQuery()` options](https://tanstack.com/query/latest/docs/framework/react/reference/useSuspenseQuery).)
 - (Optional) [Usage with Telefunc](#usage-with-telefunc). Combining RPC with all the TranStack Query goodies.

See [example](https://github.com/vikejs/vike-react/tree/main/examples/react-query).

> [!NOTE]  
> `vike-react-query` leverages [React 18's suspense streaming feature](https://github.com/brillout/react-streaming#readme). (Similar to [Next.js Loading UI and Streaming](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming), but on a component level.)


## Installation

1. `pnpm i @tanstack/react-query vike-react-query`
2. Extend `+config.ts`:
   ```ts
   // /pages/+config.ts

   import type { Config } from 'vike/types'
   import vikeReact from 'vike-react/config'
   import vikeReactQuery from 'vike-react-query/config'

   export default {
     ...
     extends: [vikeReact, vikeReactQuery]
   } satisfies Config
   ```


## Basic usage

```tsx
import { useSuspenseQuery } from '@tanstack/react-query'

const Movie = ({ id }: { id: string }) => {
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


## `withFallback()`

Using `withFallback()`, you can define a loading and/or an error fallback component:
 - While the query is loading, the `Loading` component is rendered.
 - When the query is completed and the data is available, the main component is rendered.
 - If there is an error during loading or rendering, the `Error` component is rendered.

> [!NOTE]  
> If you use SSR, the main component is rendered to HTML, and merely hydrated on the client-side: the data is re-used (instead of being fetched a second time).


```tsx
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
// /pages/+config.js

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
// /pages/product/@id/+config.js

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
// /pages/admin/+config.js

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

If used together with [Telefunc](https://telefunc.com/), the query function will always run on the server. (Similar to [Next.js Server Actions and Mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations).)

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
