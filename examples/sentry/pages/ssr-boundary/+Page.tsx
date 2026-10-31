export { Page }

import { Suspense } from 'react'

function Page() {
  return (
    <>
      <h1>SSR error inside a Suspense boundary</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <ServerError />
      </Suspense>
    </>
  )
}

function ServerError() {
  if (typeof window === 'undefined') throw new Error('SSR_BOUNDARY')
  return <p>Rendered on the client</p>
}
