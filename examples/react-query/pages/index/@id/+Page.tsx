export default Page

import React from 'react'
import { suspense, useSuspenseQuery } from 'vike-react-query'
import { usePageContext } from 'vike-react/usePageContext'
import { MovieDetails } from '../types'

function Page() {
  const { routeParams } = usePageContext()
  const id = routeParams!['id']

  return <Movie id={id} />
}

const Movie = suspense(
  ({ id }: { id: string }) => {
    const result = useSuspenseQuery({
      queryKey: ['movie', id],
      queryFn: () => getStarWarsMovie(id),
      // Disabled to showcase error fallback
      retry: false
    })

    const { title, release_date } = result.data

    return (
      <>
        <h1>Star Wars Movies</h1>
        <a href={`/star-wars/${id}`}>{title}</a> ({release_date})
        <p>
          Source: <a href="https://star-wars.brillout.com">star-wars.brillout.com</a>.
        </p>
      </>
    )
  },
  ({ id }) => `Loading movie ${id}`,
  // Try commenting out the error fallback
  ({ id, error, retry }) => (
    <>
      <div>Loading movie {id} failed</div>
      <div>{error.message}</div>
      <button onClick={() => retry()}>Try again</button>
    </>
  )
)

async function getStarWarsMovie(id: string): Promise<MovieDetails> {
  await new Promise((r) => setTimeout(r, 500))

  if (Math.random() > 0.4) {
    throw new Error('Failed to fetch')
  }

  const response = await fetch(`https://star-wars.brillout.com/api/films/${id}.json`)
  return response.json()
}
