import { WrapApolloProvider } from '@apollo/client-react-streaming'
import { buildManualDataTransport } from '@apollo/client-react-streaming/manual-transport'
import { useStream } from 'react-streaming'
import { renderToString } from 'react-dom/server'
import React from 'react'
import { assert } from '../utils/assert.js'
import { usePageContext } from 'vike-react/usePageContext'

export const WrappedApolloProvider = WrapApolloProvider(
  buildManualDataTransport({
    useInsertHtml() {
      const stream = useStream()
      const pageContext = usePageContext()
      if (globalThis.__VIKE__IS_CLIENT) {
        return () => {}
      }
      assert(!pageContext.isClientSide)
      assert(stream)
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
