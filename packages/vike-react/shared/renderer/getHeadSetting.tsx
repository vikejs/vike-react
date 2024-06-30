export { getHeadSetting }

import type { PageContext } from 'vike/types'
import { isCallable } from '../utils/isCallable.js'

function getHeadSetting(
  headSetting: 'title' | 'favicon' | 'lang',
  pageContext: PageContext
): undefined | null | string {
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
