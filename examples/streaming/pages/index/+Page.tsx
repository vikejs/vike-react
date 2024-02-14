export default Page

import React, { Suspense, useState } from 'react'
import { useAsync } from 'react-streaming'
import { Counter } from '../../components/Counter'

function Page() {
  const [count, setCount] = useState(0)
  return (
    <>
      <h1>Star Wars Movies</h1>
      <Counter />
      <Suspense fallback={<p>Loading...</p>}>
        <MovieList />
      </Suspense>
    </>
  )
}

function MovieList() {
  const movies = useAsync(['star-wars-movies'], async () => {
    const response = await fetch('https://star-wars.brillout.com/api/films.json')
    // Simulate slow network
    await new Promise((r) => setTimeout(r, 2 * 1000))
    const movies: Movie[] = (await response.json()).results
    return movies
  })

  return (
    <ol>
      {movies.map((movies, index) => (
        <li key={index}>
          {movies.title} ({movies.release_date})
        </li>
      ))}
    </ol>
  )
}

export type Movie = {
  title: string
  release_date: string
}
