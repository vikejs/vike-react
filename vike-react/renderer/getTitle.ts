export { getTitle }

import type { ConfigEntries } from 'vite-plugin-ssr/types'
import { isCallable } from './utils/isCallable.js'

function getTitle(pageContext: {
  title?: unknown
  config: Record<string, unknown>
  configEntries: ConfigEntries
}): null | string {
  if (pageContext.title) {
    if (typeof pageContext.title !== 'string') {
      throw new Error('pageContext.title should be a string')
    }
    return pageContext.title
  } else {
    const titleConfig = pageContext.configEntries.title?.[0]
    if (!titleConfig) {
      return null
    }
    const title = titleConfig.configValue
    if (typeof title === 'string') {
      return title
    }
    if (!title) {
      return null
    }
    const { configDefinedAt } = titleConfig
    if (isCallable(title)) {
      const val = title(pageContext)
      if (typeof val !== 'string') {
        throw new Error(configDefinedAt + ' should return a string')
      }
      return val
    }
    throw new Error(configDefinedAt + ' should be a string or a function returning a string')
  }
}
