export { route }

import type { PageContext } from 'vike/types'

function route(pageContext: PageContext) {
  if (pageContext.urlPathname === '/route-error') throw new Error('ROUTE_ERR')
  return false
}
