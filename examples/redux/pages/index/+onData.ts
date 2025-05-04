// Environment: server, client
export { onData }

import type { PageContext } from 'vike/types'
import type { Data } from './+data'
import { initializeCount } from '../../store/slices/counter'
import { initializeTodos } from '../../store/slices/todos'

function onData(pageContext: PageContext & { data: Data }) {
  /* Can be simplified after https://github.com/vikejs/vike/issues/1268
  const { store } = pageContext.redux!
  /*/
  const store = !pageContext.isClientSide ? pageContext.redux!.store : pageContext.globalContext.redux!.store
  //*/
  store.dispatch(initializeTodos(pageContext.data.todosInit))
  store.dispatch(initializeCount(pageContext.data.countInit))
}
