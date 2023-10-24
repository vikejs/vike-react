export { getTitle }

import type { PageContext } from 'vike/types'
import { isCallable } from './utils/isCallable.js'

/**
 * Get the page's title if defined, either from the additional data fetched by
 * the page's onBeforeRender() hook or from the config.
 */
function getTitle(pageContext: PageContext): null | string {
  if (pageContext.title !== undefined) {
    return pageContext.title
  }

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
