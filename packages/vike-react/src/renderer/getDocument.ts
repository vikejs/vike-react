export { getDocument }
export { getDocumentElementsIsomoprh }

import type { PageContext } from 'vike/types'
import type { Document } from '../types/Document.js'
import { assert } from '../utils/assert.js'

function getDocumentElementsIsomoprh(pageContext: PageContext): {
  title: undefined | string
  lang: undefined | string
  favicon: undefined | string
} {
  const document = getDocument(pageContext)

  let title = document.title
  let lang = document.locale
  // TODO
  const favicon = document.icon as string | undefined

  return {
    title,
    lang,
    favicon
  }
}

function getDocument(pageContext: PageContext): Document {
  const documentValues = pageContext.from.configsCumulative.document?.values ?? []
  let newInterfaceUsedAt: `at ${string}` | 'with useDocument()' | undefined
  const documentMerged: Document = {}
  documentValues.reverse().forEach((v) => {
    newInterfaceUsedAt = `at ${v.definedAt}`
    // We don't valitae but type cast instead in order to save client-side KBs.
    const document = v.value as Document
    forEach(document, (key, value) => {
      assert(value !== undefined)
      documentMerged[key] = value
    })
  })
  {
    // We don't valitae but type cast instead in order to save client-side KBs.
    const documentFromPageContext: Document = '_document' in pageContext ? (pageContext as any)._document : {}
    forEach(documentFromPageContext, (key, value) => {
      if (!newInterfaceUsedAt) {
        newInterfaceUsedAt = 'with useDocument()'
      }
      documentMerged[key] = value
    })
  }

  // Assert user doesn't mix old and new interface.
  if (newInterfaceUsedAt) {
    ;(['title', 'lang', 'favicon'] as const).forEach((prop) => {
      if (pageContext.from.configsStandard[prop]) {
        const definedAtOld = pageContext.from.configsStandard[prop]!.definedAt
        assert(definedAtOld)
        throw new Error(
          `You're using the new interface ${newInterfaceUsedAt} as well as the old interface at ${definedAtOld} but you cannot use both at the same time: either always use the new interface, or always use the old interface.`
        )
      }
      assert(!(prop in pageContext.config))
    })
  }

  return documentMerged
}

function forEach<Obj extends object>(
  obj: Obj,
  iterator: <Key extends keyof Obj>(key: Key, val: Obj[Key]) => void
): void {
  Object.entries(obj).forEach(([key, val]) => iterator(key as keyof Obj, val))
}
