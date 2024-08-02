export { getHeadSetting }

import { isCallable } from '../utils/isCallable.js'
import type { PageContext } from 'vike/types'
import type { PageContextInternal } from '../types/PageContext.js'
import type { ConfigFromHookResolved } from '../types/Config.js'

type HeadSetting = 'favicon' | 'lang' | 'title' | 'description' | 'image'
type HeadSettingFromHook = HeadSetting & keyof ConfigFromHookResolved
function getHeadSetting(
  headSetting: HeadSetting,
  pageContext: PageContext & PageContextInternal
): undefined | null | string {
  {
    const val: undefined | string = pageContext._configFromHook?.[headSetting as HeadSettingFromHook]
    if (val !== undefined) return val
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
