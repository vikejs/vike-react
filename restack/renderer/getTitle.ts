export { getTitle }

import { isCallable } from './utils/isCallable'

function getTitle(pageContext: {
  title?: unknown
  config: Record<string, unknown>
  configList: Record<string, undefined | { configOrigin: string }[]>
}): null | string {
  if (typeof pageContext.title === 'string') {
    return pageContext.title
  }
  if (pageContext.title) {
    throw new Error('pageContext.title should be a string')
  }
  const { title } = pageContext.config
  if (typeof title === 'string') {
    return title
  }
  if (!title) {
    return null
  }
  const { configOrigin } = pageContext.configList.title![0]!
  if (isCallable(title)) {
    const val = title(pageContext)
    if (typeof val === 'string') {
      return val
    }
    if (val) {
      throw new Error(configOrigin + ' `export { title }` should return a string')
    }
  }
  throw new Error(configOrigin + ' `export { title }` should be a string or a function returning a string')
}
