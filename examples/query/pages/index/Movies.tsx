export { Movies }

import React from 'react'
import { withFallback } from 'vike-react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { navigate } from 'vike/client/router'
import { MovieDetails } from './types'
import { Config } from 'vike-react/Config'
import { Head } from 'vike-react/Head'

const Movies = withFallback(() => {
  const result = useSuspenseQuery({
    queryKey: ['movies'],
    queryFn: getStarWarsMovies,
  })

  const movies = result.data
  const onNavigate = (id: string) => {
    navigate(`/${id}`)
  }

  return (
    <>
      <Config title={`${movies.length} movies`} />
      <Head>
        <meta name="description" content={`List of ${movies.length} Star Wars movies.`} />
      </Head>
      <h1>Star Wars Movies</h1>
      <ol>
        {movies.map(({ id, title, release_date }) => (
          <li key={id}>
            <button onClick={() => onNavigate(id)}>{title}</button> ({release_date})
          </li>
        ))}
      </ol>
      <p>
        Source: <a href="https://star-wars.brillout.com">star-wars.brillout.com</a>.
      </p>
    </>
  )
}, 'Loading movies...')

async function getStarWarsMovies(): Promise<MovieDetails[]> {
  // Simulate slow network
  await sleep(4000)

  const response = await fetch('https://star-wars.brillout.com/api/films.json')
  let movies: MovieDetails[] = ((await response.json()) as any).results
  movies = movies.map((movie: MovieDetails, i: number) => ({
    ...movie,
    id: String(i + 1),
  }))
  return movies
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((r) => setTimeout(r, milliseconds))
}
