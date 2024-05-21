export { useDocument }

import { assert } from '../utils/assert.js'
import { usePageContext } from './usePageContext.js'
import { useStream } from 'react-streaming'
import type { Document } from '../types/Document.js'
import type { DocumentSetter } from './useDocument-types.js'
import { getPageContext } from 'vike/getPageContext'

function useDocument(): DocumentSetter {
  const documentSetter = (document: Document) => {
    ;(pageContext as any)._document = document
  }

  // getPageContext() enables using useDocument() in Vike hooks
  let pageContext = getPageContext()
  if (pageContext) {
    return documentSetter
  }

  // usePageContext() enables using useDocument() in React components (as React hook)
  pageContext = usePageContext()
  const stream = useStream()
  return (document: Document) => {
    const htmlHeadAlreadySet: boolean | undefined = (pageContext as any)._htmlHeadAlreadySet

    // No need to use HTML Streaming
    if (htmlHeadAlreadySet === false) {
      documentSetter(document)
      return
    }

    // <head> already sent to the browser => we send HTML snippets during the HTML Stream
    assert(htmlHeadAlreadySet === true)
    assert(stream)
    {
      const { title } = document
      if (title) {
        assert(typeof title === 'string')
        // JSON is safe, thus JSON.stringify() should as well.
        const htmlSnippet = `<script>document.title = ${JSON.stringify(title)}</script>`
        stream.injectToStream(htmlSnippet)
      }
    }
  }
}
