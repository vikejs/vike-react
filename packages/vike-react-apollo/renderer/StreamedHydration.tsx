export { StreamedHydration }

import { ApolloLink, InMemoryCache, Observable, from, type ApolloClient } from '@apollo/client/index.js'
import { uneval } from 'devalue'
import type { ReactNode } from 'react'
import { useStream } from 'react-streaming'

declare global {
  interface Window {
    _rad_?: { push: (entry: any) => void } | any[]
    _rac_?: () => void
  }
}

/**
 * This component is responsible for:
 * - dehydrating the apollo client on the server
 * - hydrating the apollo client on the client
 * - if react-streaming is not used, it doesn't do anything
 */
function StreamedHydration({ client, children }: { client: ApolloClient<any>; children: ReactNode }) {
  const stream = useStream()

  // stream is only avaiable in SSR
  const isSSR = !!stream

  if (isSSR) {
    stream.injectToStream(
      `<script class="_rad_">_rad_=[];_rac_=()=>{Array.from(
        document.getElementsByClassName("_rad_")
      ).forEach((e) => e.remove())};_rac_()</script>`
    )
    if (client.cache instanceof InMemoryCache) {
      const consoleLink = new ApolloLink((operation, forward) => {
        // TODO: only send diffs
        return new Observable((observer) => {
          const observable = forward(operation)
          const subscription = observable.subscribe({
            next(value) {
              observer.next(value)
              const extracted = client.extract()
              stream.injectToStream(`<script class="_rad_">_rad_.push(${uneval(extracted)});_rac_()</script>`)
            },
            error(e) {
              observer.error(e)
            },
            complete() {
              observer.complete()
            }
          })

          return () => subscription.unsubscribe()
        })
      })

      client.setLink(from([consoleLink, client.link]))
    }
  }

  if (!isSSR && Array.isArray(window._rad_)) {
    const onEntry = (entry: any) => {
      client.restore(entry)
    }
    for (const entry of window._rad_) {
      onEntry(entry)
    }
    window._rad_ = { push: onEntry }
  }
  return children
}
