export default Page

import React, { useEffect } from 'react'
import { Counter } from './Counter'
import { useStore } from '../../about-store'
import { useStoreApi } from 'vike-react-zustand-experimental'

function Page() {
  const nodeVersion = useStore((s) => s.nodeVersionAbout)
  const storeApi = useStoreApi(useStore)
  useEffect(
    () =>
      storeApi.subscribe((state) => {
        console.log(state)
      }),
    [],
  )

  return (
    <>
      <h1>Welcome</h1>
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
