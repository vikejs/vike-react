export default Page

import React from 'react'
import { Counter } from './Counter'
import { Movies } from './Movies'

function Page() {
  return (
    <>
      <h1>My Vike + React app</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive while loading. <Counter />
        </li>
      </ul>
      <Movies />
    </>
  )
}
