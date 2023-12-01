export { StreamedHydration }

import type { QueryClient } from '@tanstack/react-query'
import { dehydrate, hydrate, DehydratedState } from '@tanstack/react-query'
import { uneval } from 'devalue'
import { useStream } from 'react-streaming'

declare global {
  interface Window {
    _rqd_?: { push: (entry: DehydratedState) => void } | string[]
    _rqc_?: () => void
  }
}

/**
 * This component is responsible for:
 * - dehydrating the query client on the server
 * - hydrating the query client on the client
 * - if react-streaming is not used, it doesn't do anything
 */
function StreamedHydration({ client }: { client: QueryClient }) {
  const stream = useStream()

  if (import.meta.env.SSR && stream) {
    stream.injectToStream(
      `<script class="_rqd_">_rqd_=[];_rqc_=()=>{Array.from(
        document.getElementsByClassName("_rqd_")
      ).forEach((e) => e.remove())};_rqc_()</script>`
    )
    client.getQueryCache().subscribe((event) => {
      if (['added', 'updated'].includes(event.type) && event.query.state.status === 'success')
        stream.injectToStream(
          `<script class="_rqd_">_rqd_.push(${uneval(
            dehydrate(client, {
              shouldDehydrateQuery: (query) => query.queryHash === event.query.queryHash
            })
          )});_rqc_()</script>`
        )
    })
  }

  if (!import.meta.env.SSR && Array.isArray(window._rqd_)) {
    const onEntry = (entry: DehydratedState) => {
      hydrate(client, entry)
    }
    for (const entry of window._rqd_) {
      onEntry(entry)
    }
    window._rqd_ = { push: onEntry }
  }
  return null
}
