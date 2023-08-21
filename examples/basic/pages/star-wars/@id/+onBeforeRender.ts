export default onBeforeRender

import fetch from 'cross-fetch'
import { filterMovieData } from '../filterMovieData'
import type { PageContextBuiltIn } from 'vike-react/types'
import type { AdditionalPageContext, MovieDetails } from '../types'

async function onBeforeRender(
  pageContext: PageContextBuiltIn
): Promise<AdditionalPageContext<{ movie: MovieDetails }, { title: string }>> {
  const response = await fetch(`https://star-wars.brillout.com/api/films/${pageContext.routeParams.id}.json`)
  let movie = (await response.json()) as MovieDetails

  // We remove data we don't need because we pass `pageContext.movie` to
  // the client; we want to minimize what is sent over the network.
  movie = filterMovieData(movie)

  const { title } = movie

  return {
    pageContext: {
      // Will be passed as properties to the page's root React component.
      pageProps: {
        movie
      },

      // Will be available in onRenderClient() and onRenderHtml().
      additionalData: {
        // The renderers will use this data as page's <title>
        title
      }
    }
  }
}
