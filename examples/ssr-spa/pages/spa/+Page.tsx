export default Page

import React from 'react'

function Page() {
  // Will be printed only in the browser:
  console.log('Rendering SPA page')

  return (
    <>
      <h1>My Vike + React app</h1>
      This page is rendered only in the browser.
    </>
  )
}
