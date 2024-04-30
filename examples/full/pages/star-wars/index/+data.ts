// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>

import fetch from 'node-fetch'
import type { Movie, MovieDetails } from '../types'
import { useDocument } from 'vike-react/useDocument'

const data = async () => {
  const document = useDocument()

  const response = await fetch('https://brillout.github.io/star-wars/api/films.json')
  const moviesData = (await response.json()) as MovieDetails[]

  // Set <title>
  document({ title: `${moviesData.length} Star Wars Movies` })

  // We remove data we don't need because the data is passed to the client; we should
  // minimize what is sent over the network.
  const movies = minimize(moviesData)

  return movies
}

function minimize(movies: MovieDetails[]): Movie[] {
  return movies.map((movie) => {
    const { title, release_date, id } = movie
    return { title, release_date, id }
  })
}
