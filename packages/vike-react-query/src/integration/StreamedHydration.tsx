export { StreamedHydration }

import type { QueryClient } from '@tanstack/react-query'
import { dehydrate, hydrate, type DehydratedState } from '@tanstack/react-query'
import { assert } from '../utils/assert.js'
import { stringify } from '@brillout/json-serializer/stringify'
import { parse } from '@brillout/json-serializer/parse'
import type { ReactNode } from 'react'
import { useStream } from 'react-streaming'
import { usePageContext } from 'vike-react/usePageContext'

declare global {
  interface Window {
    _rqd_?: { push: (entry: string) => void } | string[]
    _rqc_?: () => void
  }
}

/**
 * This component is responsible for:
 * - dehydrating the query client on the server
 * - hydrating the query client on the client
 * - if react-streaming is not used, it doesn't do anything
 */
function StreamedHydration({ client, children }: { client: QueryClient; children: ReactNode }) {
  const stream = useStream()
  const pageContext = usePageContext()

  if (!globalThis.__VIKE__IS_CLIENT) {
    assert(!pageContext.isClientSide)
    assert(stream)
    // No need to escape the injected HTML — see https://github.com/vikejs/vike/blob/36201ddad5f5b527b244b24d548014ec86c204e4/packages/vike/src/server/runtime/renderPageServer/csp.ts#L45
    const nonceAttr = pageContext.cspNonce ? ` nonce="${pageContext.cspNonce}"` : ''

    stream.injectToStream(
      `<script class="_rqd_"${nonceAttr}>_rqd_=[];_rqc_=()=>{Array.from(
        document.getElementsByClassName("_rqd_")
      ).forEach((e) => e.remove())};_rqc_()</script>`,
    )

    const alreadySent = new Set<string>()

    const unsubscribe = client.getQueryCache().subscribe((event) => {
      if (stream.hasStreamEnded() || event.query.state.status !== 'success') return

      let shouldSend = false
      switch (event.type) {
        case 'added':
        // Also `observerAdded` and `observerResultsUpdated` for queries pre-fetched before subscription.
        // https://github.com/vikejs/vike-react/pull/192
        case 'observerAdded':
        case 'observerResultsUpdated':
          if (!alreadySent.has(event.query.queryHash)) {
            alreadySent.add(event.query.queryHash)
            shouldSend = true
          }
          break
        case 'updated':
          // Always send on `updated` events (even if already sent once), since updates may change the query data.
          shouldSend = true
          break
      }
      if (!shouldSend) return

      const serialized = serialize(
        dehydrate(client, {
          shouldDehydrateQuery: (query) => query.queryHash === event.query.queryHash,
        }),
      )
      stream.injectToStream(
        `<script class="_rqd_"${nonceAttr}>_rqd_.push(${JSON.stringify(serialized)});_rqc_()</script>`,
      )
    })

    // Unsubscribe
    stream.streamEnd.then(() => {
      unsubscribe()
    })
    // Properly handling rejection is complex, but luckily streamEnd never rejects
    // https://github.com/brillout/promise-forwarding
    stream.streamEnd.catch(() => assert(false)) // streamEnd never rejects
  }

  if (globalThis.__VIKE__IS_CLIENT && Array.isArray(window._rqd_)) {
    const onEntry = (entry: string) => {
      hydrate(client, deserialize(entry))
    }
    for (const entry of window._rqd_) {
      onEntry(entry)
    }
    window._rqd_ = { push: onEntry }
  }
  return children
}

// We use @brillout/json-serializer instead of devalue (https://github.com/vikejs/vike-react/pull/220).
// We escape `/` so that the serialized string can't break out of the injected <script> tag (like Vike does).
function serialize(state: DehydratedState): string {
  return stringify(state, {
    forbidReactElements: true,
    replacer: (_key, value) =>
      typeof value === 'string' ? { replacement: value.replaceAll('/', '\\/'), resolved: false } : undefined,
  })
}
function deserialize(serialized: string): DehydratedState {
  return parse(serialized, {
    reviver: (_key, value) =>
      typeof value === 'string' ? { replacement: value.replaceAll('\\/', '/'), resolved: false } : undefined,
  }) as DehydratedState
}
