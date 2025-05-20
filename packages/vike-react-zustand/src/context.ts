export { setPageContext }
export { getPageContext }

import type { PageContext } from 'vike/types'
import { getGlobalObject } from './utils/getGlobalObject.js'

const globalObject = getGlobalObject('context.ts', {
  pageContextCurrent: null as PageContext | null,
})

function setPageContext(pageContext: PageContext | null) {
  globalObject.pageContextCurrent = pageContext
}

function getPageContext() {
  return globalObject.pageContextCurrent
}
