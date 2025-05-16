// Environment: server, client
export { onData }

import type { PageContext } from 'vike/types'
import type { Data } from './+data'
import { initializeCount } from '../../store/slices/count'

function onData(pageContext: PageContext & { data: Data }) {
  const { store } = pageContext
  store.dispatch(initializeCount(pageContext.data.countInit))

  // Save KBs: we don't need pageContext.data on the client-side (we use the store instead).
  // - If we don't delete pageContext.data then Vike sends pageContext.data to the client-side.
  // - This optimization only works if you SSR your page: if you pre-render your page then don't do this.
  if (!pageContext.isClientSide && !pageContext.isPrerendering) delete (pageContext as { data?: Data }).data
}
