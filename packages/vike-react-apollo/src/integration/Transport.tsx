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
      const pageContext = usePageContext()
      if (!stream) {
        return () => {}
      }
      return (callback: () => React.ReactNode) => {
        // Add CSP nonce attribute if configured
        // No need to escape — pageContext.cspNonce is controlled by the developer, not by the website visitor
        const nonce = (pageContext as any).cspNonce
        stream.injectToStream(
          // https://github.com/apollographql/apollo-client-nextjs/issues/325
          (async () => {
            const html = renderToString(await callback())
            // Add nonce to all script tags if CSP nonce is configured
            if (nonce) {
              return html.replace(/<script(\s|>)/g, `<script nonce="${nonce}"$1`)
            }
            return html
          })(),
        )
      }
    },
  }),
)
