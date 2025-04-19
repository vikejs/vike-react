export { data }

import type { PageContextServer } from 'vike/types'
import { initializeCount } from '../lib/features/counter/counterSlice'

function data(pageContext: PageContextServer) {
  // Add initial data to the store
  pageContext.reduxStore!.dispatch(initializeCount(42))
}
