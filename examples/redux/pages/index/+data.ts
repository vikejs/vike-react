// Environment: server
export { data }
export type Data = Awaited<ReturnType<typeof data>>

import { fetchCountInit } from '../../components/Counter/fetchCountInit'
import type { PageContextServer } from 'vike/types'

async function data(pageContext: PageContextServer) {
  const countInit = await fetchCountInit()
  const todosInit = await fetchTodosInit()
  return {
    countInit,
    todosInit,
  }
}

// Pretending the list is fetched over the network
async function fetchTodosInit() {
  return [{ text: 'Buy apples' }, { text: `Update Node.js ${process.version} to latest version` }]
}
