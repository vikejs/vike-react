// Environment: server, client
export { onData }

import type { PageContext } from 'vike/types'
import type { Data } from './+data'
import { initializeCount } from '../../store/slices/counter'

function onData(pageContext: PageContext & { data: Data }) {
  const store = !pageContext.isClientSide ? pageContext.redux.store : pageContext.globalContext.redux.store
  store.dispatch(initializeCount(pageContext.data.countInit))
}
