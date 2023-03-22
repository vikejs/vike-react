export default Page

import React from 'react'
import { Counter } from './Counter'

function Page() {
  return (
    <>
      <h1>My Restack app</h1>
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
