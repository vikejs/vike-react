export { data }

import { initializeCount } from '../../store/slices/counter'
import type { PageContextServer } from 'vike/types'
import { initializeTodos } from '../../store/slices/todos'
import { fetchCounterInitValue } from '../../components/Counter/fetchCounterInitValue'

async function data(pageContext: PageContextServer) {
  const counterIniValue = await fetchCounterInitValue()
  pageContext.redux!.store.dispatch(initializeCount(counterIniValue))
  pageContext.redux!.store.dispatch(initializeTodos([]))
}
