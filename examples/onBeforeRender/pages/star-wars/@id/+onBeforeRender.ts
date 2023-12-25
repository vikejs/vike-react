// https://vike.dev/onBeforeRender
export { onBeforeRender }

import fetch from 'cross-fetch'
import { filterMovieData } from '../filterMovieData'
import type { OnBeforeRenderAsync } from 'vike/types'
import type { MovieDetails } from '../types'

const onBeforeRender: OnBeforeRenderAsync = async (pageContext): ReturnType<OnBeforeRenderAsync> => {
  const response = await fetch(`https://star-wars.brillout.com/api/films/${pageContext.routeParams.id}.json`)
  let movie = (await response.json()) as MovieDetails

  // We remove data we don't need because the data is passed to the client; we should
  // minimize what is sent over the network.
  movie = filterMovieData(movie)

  return {
    pageContext: {
      // Will be passed as properties to the page's root React component.
      pageProps: {
        movie
      }
    }
  }
}
