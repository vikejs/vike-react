export default Page

import React from 'react'
import { Counter } from './Counter'
import { useStore } from '../../store'
import { useStoreApi } from 'vike-react-zustand'

function Page() {
  const nodeVersion = useStore((s) => s.nodeVersion)
  const storeApi = useStoreApi(useStore)

  console.log(storeApi.getState())

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
      <div>Node version from server: {nodeVersion}</div>
    </>
  )
}
