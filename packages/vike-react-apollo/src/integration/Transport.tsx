import { WrapApolloProvider } from '@apollo/client-react-streaming'
import { buildManualDataTransport } from '@apollo/client-react-streaming/manual-transport'
import { useStream } from 'react-streaming'
import { renderToString } from 'react-dom/server'
import React from 'react'
import { usePageContext } from 'vike-react/usePageContext'

export const WrappedApolloProvider = WrapApolloProvider(
  buildManualDataTransport({
    useInsertHtml() {
      const stream = useStream()
      // TODO/ai this is brittle, prefer passing pageContext to <WrappedApolloProvider pageContext={pageContext} />
      const pageContext = usePageContext()
      // TODO/ai use globalThis.__VIKE__IS_CLIENT (because Vike will tree-shake it and thus reduce client-side KBs) then use assert(!pageContext.isClientSide) to avoid the any below at `(pageContext as any)`
      if (!stream) {
        return () => {}
      }
      return (callback: () => React.ReactNode) => {
        const nonce = (pageContext as any).cspNonce
        stream.injectToStream(
          // https://github.com/apollographql/apollo-client-nextjs/issues/325
          (async () => {
            let html = renderToString(await callback())
            if (nonce) {
              // No need to escape the injected HTML — see https://github.com/vikejs/vike/blob/36201ddad5f5b527b244b24d548014ec86c204e4/packages/vike/src/server/runtime/renderPageServer/csp.ts#L45
              html = html.replace(/<script(\s|>)/g, `<script nonce="${nonce}"$1`)
            }
            return html
          })(),
        )
      }
    },
  }),
)
