export { StreamedHydration }

import { uneval } from 'devalue'
import type { ReactNode } from 'react'
import { PASS_TO_CLIENT, type StoreApi } from '../src/types.js'
import { useStream } from 'react-streaming'
import { mergeWith, isEqual, cloneDeep, pick } from 'lodash-es'

type Entry = Record<string, unknown>
declare global {
  interface Window {
    _rzstd_?: { push: (entry: Entry) => void } | Entry[]
    _rzstdc_?: () => void
  }
}

/**
 * This component is responsible for:
 * - dehydrating the store on the server
 * - hydrating the store on the client
 * - if react-streaming is not used, it doesn't do anything
 */
function StreamedHydration({ store, children }: { store: StoreApi; children: ReactNode }) {
  const stream = useStream()

  // stream is only avaiable in SSR
  const isSSR = !!stream

  if (isSSR) {
    stream.injectToStream(
      `<script class="_rzstd_">_rzstd_=[];_rzstdc_=()=>{Array.from(
        document.getElementsByClassName("_rzstd_")
      ).forEach((e) => e.remove())};_rzstdc_()</script>`
    )

    const state = store.getState()
    if (state && typeof state === 'object' && PASS_TO_CLIENT in state && Array.isArray(state[PASS_TO_CLIENT])) {
      stream.injectToStream(
        `<script class="_rzstd_">_rzstd_.push(${uneval(pick(state, state[PASS_TO_CLIENT]))});_rzstdc_()</script>`
      )
    }

    store.subscribe((newState, oldState) => {
      stream.injectToStream(
        `<script class="_rzstd_">_rzstd_.push(${uneval(diff(newState, oldState))});_rzstdc_()</script>`
      )
    })
  }

  if (!isSSR && Array.isArray(window._rzstd_)) {
    const onEntry = (entry: Entry) => {
      const merged = mergeWith(cloneDeep(store.getState()), entry)
      store.setState(merged)
    }
    for (const entry of window._rzstd_) {
      onEntry(entry)
    }
    window._rzstd_ = { push: onEntry }
  }
  return children
}

const diff = (newState: any, oldState: any) => {
  const output: any = {}
  Object.keys(newState).forEach((key) => {
    if (
      newState[key] !== null &&
      newState[key] !== undefined &&
      typeof newState[key] !== 'function' &&
      !isEqual(newState[key], oldState[key])
    ) {
      if (typeof newState[key] === 'object' && !Array.isArray(newState[key])) {
        const value = diff(newState[key] as Entry, oldState[key] as Entry)
        if (value && Object.keys(value).length > 0) {
          output[key] = value
        }
      } else {
        output[key] = newState[key]
      }
    }
  })

  return output
}
