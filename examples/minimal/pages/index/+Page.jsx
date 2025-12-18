export default Page

import React from 'react'
import { Counter } from './Counter'
import { ClientOnly } from 'vike-react/ClientOnly'
import ClientOnlyComponent from './ClientOnlyComponent'

function Page() {
  return (
    <>
      <h1>Welcome</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
        <ClientOnly fallback={<li>Loading client-only component...</li>}>
          <ClientOnlyComponent />
          <div>This is a test</div>
        </ClientOnly>
      </ul>
    </>
  )
}
