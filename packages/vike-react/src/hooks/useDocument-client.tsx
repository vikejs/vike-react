export { useDocument }

import type { Document } from '../types/Document.js'
import type { DocumentSetter } from './useDocument-types.js'

function useDocument(): DocumentSetter {
  return (document: Document) => {
    {
      const { title } = document
      if (title) window.document.title = title
    }
  }
}
