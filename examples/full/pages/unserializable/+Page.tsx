export { Page }

import React from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { Counter } from '../../components/Counter'

function Page() {
  const { urlParsed } = usePageContext()
  const n = Number(urlParsed.search.n ?? 1)
  return (
    <>
      <p>
        Page <span id="n">{n}</span>, whose data holds a function
      </p>
      <p>
        <a href={`/unserializable?n=${n + 1}`}>Next page</a>
      </p>
      <Counter />
    </>
  )
}
