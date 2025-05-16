// Environment: server, client
export { onData }

import type { PageContext } from 'vike/types'
import type { Data } from './+data'
import { initializeCount } from '../../store/slices/count'
import { initializeTodos } from '../../store/slices/todos'

function onData(pageContext: PageContext & { data: Data }) {
  const { store } = pageContext
  store.dispatch(initializeTodos(pageContext.data.todosInit))
  store.dispatch(initializeCount(pageContext.data.countInit))
  // Save KBs: we don't need to pass the data to the client-side
  if (!pageContext.isClientSide && !pageContext.isPrerendering) delete (pageContext as { data?: Data }).data
}
