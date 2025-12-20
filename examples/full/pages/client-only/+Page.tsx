export default Page

import React from 'react'
import { Counter } from '../../components/Counter'
import { clientOnly } from 'vike-react/clientOnly'
import { ClientOnly } from 'vike-react/ClientOnly'
import ClientOnlyComponent from '../../components/ClientOnlyComponent'

const ClientOnlyComponentLazy = clientOnly(() => import('../../components/ClientOnlyComponent'))

function Page() {
  return (
    <>
      <h1>My Vike + React app</h1>
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
      <ClientOnlyComponentLazy fallback="Loading the ClientOnlyComponent..." />
    </>
  )
}
