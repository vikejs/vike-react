export { getLang }

import type { PageContext } from 'vike/types'
import { isCallable } from './utils/isCallable.js'

/**
 * Get the page's lang if defined, either from the config, the additional data fetched by
 * the page's data() and onBeforeRender() hooks or from other hooks.
 */
function getLang(pageContext: PageContext): null | string {
  // from onBeforeRoute() hook & other hooks, e.g. onPrerenderStart() hook
  if (pageContext.lang !== undefined) {
    return pageContext.lang
  }

  const langConfig = pageContext.configEntries.lang?.[0]
  if (!langConfig) {
    return null
  }
  const lang = langConfig.configValue
  if (typeof lang === 'string') {
    return lang
  }
  if (!lang) {
    return null
  }
  const { configDefinedAt } = langConfig
  if (isCallable(lang)) {
    const val = lang(pageContext)
    if (typeof val !== 'string') {
      throw new Error(configDefinedAt + ' should return a string')
    }
    return val
  }
  throw new Error(configDefinedAt + ' should be a string or a function returning a string')
}
