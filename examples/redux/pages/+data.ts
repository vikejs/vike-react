export { data }

import { initializeCount } from '../store/slices/counter'
import type { PageContextServer } from 'vike/types'

function data(pageContext: PageContextServer) {
  // Add initial data to the store
  pageContext.reduxStore!.dispatch(initializeCount(42))
}
