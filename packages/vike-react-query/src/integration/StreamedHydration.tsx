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
    // The dehydrated state is serialized to a string (using @brillout/json-serializer) and parsed on the client.
    _rqd_?: { push: (entry: string) => void } | string[]
    _rqc_?: () => void
  }
}

// We use @brillout/json-serializer (instead of devalue) to serialize the dehydrated state, see
// https://github.com/vikejs/vike-react/pull/220
//
// Unlike devalue's uneval(), json-serializer's stringify() doesn't escape the serialized string for safe injection
// into a <script> tag. We therefore escape it ourselves (replacing `/` with `\/` prevents `</script>` from breaking
// out of the tag), the same way Vike does it for pageContext:
// https://github.com/vikejs/vike/blob/main/packages/vike/src/server/runtime/renderPageServer/html/serializeContext.ts
function serializeDehydratedState(value: DehydratedState): string {
  return stringify(value, {
    forbidReactElements: true,
    replacer(_key, value) {
      if (typeof value === 'string') {
        return { replacement: value.replaceAll('/', '\\/'), resolved: false }
      }
    },
  })
}
function parseDehydratedState(serialized: string): DehydratedState {
  return parse(serialized, {
    reviver(_key, value) {
      if (typeof value === 'string') {
        return { replacement: value.replaceAll('\\/', '/'), resolved: false }
      }
    },
  }) as DehydratedState
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

      const serialized = serializeDehydratedState(
        dehydrate(client, {
          shouldDehydrateQuery: (query) => query.queryHash === event.query.queryHash,
        }),
      )
      // JSON.stringify() embeds the serialized string as a JS string literal (the escaping done in
      // serializeDehydratedState() keeps `</script>` from breaking out of the <script> tag).
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
      hydrate(client, parseDehydratedState(entry))
    }
    for (const entry of window._rqd_) {
      onEntry(entry)
    }
    window._rqd_ = { push: onEntry }
  }
  return children
}
