export default Page

import React, { useEffect } from 'react'
import { Counter } from '../../components/Counter'
import { useStore } from '../../store'
import { useStoreVanilla } from 'vike-react-zustand'

function Page() {
  const nodeVersion = useStore((s) => s.nodeVersion)
  const storeVanilla = useStoreVanilla(useStore)
  useEffect(
    () =>
      storeVanilla.subscribe((state) => {
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
