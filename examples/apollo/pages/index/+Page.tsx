export default Page

import React from 'react'
import { Counter } from './Counter'
import { Countries } from './Countries'

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
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ullamcorper neque magna, a dapibus turpis
        volutpat eget. Praesent et aliquam nisi. Integer congue nec ligula et sollicitudin.
      </div>
      <br />
      <Countries />
    </>
  )
}
