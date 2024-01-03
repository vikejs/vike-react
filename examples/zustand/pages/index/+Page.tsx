export default Page

import React, { useEffect } from 'react'
import { Counter, Counter2 } from './Counter'
import { useStore } from '../../store'
import { create, useStoreApi } from 'vike-react-zustand'

const useStore3 = create<{ a: number }>('store3')((set, get) => ({
  a: Math.floor(10000 * Math.random())
}))

function Page() {
  const nodeVersion = useStore((s) => s.nodeVersion)
  const storeApi = useStoreApi(useStore)
  useEffect(
    () =>
      storeApi.subscribe((state) => {
        console.log(state)
      }),
    []
  )

  const { a } = useStore3()
  return (
    <>
      {a}
      <h1>My Vike + React app</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive while loading. <Counter />
        </li>
        <li>
          Interactive while loading. <Counter2 />
        </li>
      </ul>
      <div>Node version from server: {nodeVersion}</div>
    </>
  )
}
