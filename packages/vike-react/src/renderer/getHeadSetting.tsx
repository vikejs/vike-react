export { getHeadSetting }

import { isCallable } from '../utils/isCallable.js'
import type { PageContextInternal } from '../types/PageContext.js'

function getHeadSetting(
  headSetting: 'title' | 'favicon' | 'lang',
  pageContext: PageContextInternal
): undefined | null | string {
  {
    const val =
      pageContext._configFromHook?.[
        // TODO
        headSetting as 'title'
      ]
    if (val) return val
  }
  const config = pageContext.configEntries[headSetting]?.[0]
  if (!config) return undefined
  const val = config.configValue
  if (typeof val === 'string') return val
  if (!val) return null
  if (isCallable(val)) {
    const valStr = val(pageContext)
    if (typeof valStr! !== 'string') {
      throw new Error(config.configDefinedAt + ' should return a string')
    }
    return valStr
  } else {
    throw new Error(config.configDefinedAt + ' should be a string or a function returning a string')
  }
}
