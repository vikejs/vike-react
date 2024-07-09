export { Page }

import React from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { Movie } from './Movie'

function Page() {
  const pageContext = usePageContext()
  const id = pageContext.routeParams!['id']
  return <Movie id={id} />
}
