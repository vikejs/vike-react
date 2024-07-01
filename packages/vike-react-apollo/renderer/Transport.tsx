import { WrapApolloProvider } from '@apollo/client-react-streaming'
import { buildManualDataTransport } from '@apollo/client-react-streaming/manual-transport'
import { useStream } from 'react-streaming'
import { renderToString } from 'react-dom/server'
import React from 'react'

export const WrappedApolloProvider = WrapApolloProvider(
  buildManualDataTransport({
    useInsertHtml() {
      const stream = useStream()
      if (!stream) {
        return () => {}
      }
      return async (callback: () => React.ReactNode) => {
        // await is needed because of https://github.com/apollographql/apollo-client-nextjs/issues/325
        const reactNode = await callback()
        const injectionsString = renderToString(reactNode)
        stream.injectToStream(injectionsString)
      }
    }
  })
)
