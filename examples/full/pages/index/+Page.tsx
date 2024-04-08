export default Page

import React from 'react'
import { Counter } from '../../components/Counter'

function Page() {
  // Will be printed on the server and in the browser:
  console.log('Rendering the landing page')

  return (
    <>
      <h1>My Vike + React app</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </>
  )
}
