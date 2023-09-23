export default onBeforeRender

import fetch from 'cross-fetch'
import { filterMovieData } from '../filterMovieData'
import type { PageContextBuiltInServer } from 'vike/types'
import type { MovieDetails } from '../types'

async function onBeforeRender(pageContext: PageContextBuiltInServer) {
  const response = await fetch(`https://star-wars.brillout.com/api/films/${pageContext.routeParams.id}.json`)
  let movie = (await response.json()) as MovieDetails

  // We remove data we don't need because we pass `pageContext.movie` to
  // the client; we want to minimize what is sent over the network.
  movie = filterMovieData(movie)

  const { title } = movie

  return {
    pageContext: {
      pageProps: {
        movie
      },
      // The page's <title>
      title
    }
  }
}
