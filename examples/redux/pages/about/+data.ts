// Environment: server
export { data }
export type Data = Awaited<ReturnType<typeof data>>

import { fetchCounterInitValue } from '../../components/Counter/fetchCounterInitValue'
import type { PageContextServer } from 'vike/types'

async function data(pageContext: PageContextServer) {
  const countInit = await fetchCounterInitValue()
  return {
    countInit,
  }
}
