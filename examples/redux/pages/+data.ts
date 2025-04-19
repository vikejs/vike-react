export { data }

import { initializeCount } from '../store/slices/counter'
import type { PageContextServer } from 'vike/types'

function data(pageContext: PageContextServer) {
  // Add initial data to the store
  pageContext.redux!.store.dispatch(initializeCount(42))
}
