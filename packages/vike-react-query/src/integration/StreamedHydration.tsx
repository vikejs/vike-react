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
    // Queue of serialized dehydrated states (the textContent of the streamed <script type="application/json"> blocks).
    _rqd_?: string[]
    // Consumes a streamed block: reads the <script type="application/json"> preceding the given trigger <script>.
    _rqc_?: (trigger: HTMLScriptElement) => void
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

    // Bootstrap: until the client runtime takes over, `_rqc_()` reads each streamed block and queues it into `_rqd_`.
    // This <script> contains no user data (the data lives in the inert <script type="application/json"> blocks below),
    // so it can't be an injection vector.
    stream.injectToStream(
      `<script${nonceAttr}>_rqd_=[];_rqc_=(s)=>{var b=s.previousElementSibling;_rqd_.push(b.textContent);b.remove();s.remove()};document.currentScript.remove()</script>`,
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
      // Inject the data as an inert <script type="application/json"> block, then a fully static <script> that reads it
      // synchronously (via `document.currentScript.previousElementSibling`). Arbitrary data thus stays confined to the
      // inert block (escaped by serialize()) and never ends up inside an executable <script>.
      stream.injectToStream(
        `<script type="application/json">${serialized}</script>` +
          `<script${nonceAttr}>_rqc_(document.currentScript)</script>`,
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
    const onEntry = (serialized: string) => hydrate(client, deserialize(serialized))
    // Hydrate the blocks streamed before the client runtime took over.
    window._rqd_.forEach(onEntry)
    window._rqd_ = undefined
    // Hydrate live for blocks streamed afterwards.
    window._rqc_ = (trigger) => {
      const block = trigger.previousElementSibling
      assert(block)
      const json = block.textContent
      assert(json)
      onEntry(json)
      block.remove()
      trigger.remove()
    }
  }
  return children
}

// We use @brillout/json-serializer to serialize the dehydrated state into the inert <script type="application/json">
// block. We escape, in the JSON itself (both are valid JSON escapes that parse() decodes):
// - `<` so the data can't break out of the <script> block (e.g. `</script>`)
// - `/` so that search engines don't crawl URLs contained in the state (like Vike, see https://github.com/vikejs/vike/pull/2603)
function serialize(state: DehydratedState): string {
  return stringify(state, { forbidReactElements: true }).replaceAll('<', '\\u003c').replaceAll('/', '\\/')
}
function deserialize(serialized: string): DehydratedState {
  return parse(serialized) as DehydratedState
}
