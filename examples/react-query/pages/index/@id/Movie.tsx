export { Movie }

import React from 'react'
import { withFallback } from 'vike-react-query'
import { useConfig } from 'vike-react/useConfig'
import { useSuspenseQuery } from '@tanstack/react-query'
import { MovieDetails } from '../types'

const Movie = withFallback(
  ({ id }: { id: string }) => {
    const config = useConfig()
    const result = useSuspenseQuery({
      queryKey: ['movie', id],
      queryFn: () => getStarWarsMovie(id),
      // Disabled to showcase error fallback
      retry: false
    })

    const { title, release_date } = result.data
    config({
      title, // <title>
      head: (
        <>
          <meta name="description" content={`Star Wars Movie ${title} from ${result.data.director}`} />
        </>
      )
    })

    return (
      <>
        <h1>Star Wars Movies</h1>
        <ul>
          <li>
            Title: <b>{title}</b>
          </li>
          <li>
            Release date: <b>{release_date}</b>
          </li>
        </ul>
        <p>
          Source: <a href="https://star-wars.brillout.com">star-wars.brillout.com</a>.
        </p>
      </>
    )
  },
  {
    Loading: ({ id }) => `Loading movie ${id}`,
    // Try commenting out the error fallback
    Error: ({ id, error, retry }) => (
      <>
        <div>Loading movie {id} failed</div>
        <div>{error.message}</div>
        <button onClick={() => retry()}>Try again</button>
      </>
    )
  }
)

async function getStarWarsMovie(id: string): Promise<MovieDetails> {
  await new Promise((r) => setTimeout(r, 500))

  if (Math.random() > 0.4) {
    throw new Error('Failed to fetch')
  }

  const response = await fetch(`https://star-wars.brillout.com/api/films/${id}.json`)
  return response.json()
}
