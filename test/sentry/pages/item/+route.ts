export { route }

import type { PageContext } from 'vike/types'

function route(pageContext: PageContext) {
  return pageContext.urlPathname.startsWith('/item/')
}
