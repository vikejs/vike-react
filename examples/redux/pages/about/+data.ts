export { data }

import { fetchCounterInitValue } from '../../components/Counter/fetchCounterInitValue'
import { initializeCount } from '../../store/slices/counter'
import type { PageContextServer } from 'vike/types'

async function data(pageContext: PageContextServer) {
  const counterIniValue = await fetchCounterInitValue()
  pageContext.redux!.store.dispatch(initializeCount(counterIniValue))
}
