export { getHeadSetting }

import { isCallable } from '../utils/isCallable.js'
import type { PageContext } from 'vike/types'
import type { PageContextInternal } from '../types/PageContext.js'
import type { ConfigFromHookResolved } from '../types/Config.js'

// We use `any` instead of doing proper validation in order to save KBs sent to the client-side

type HeadSetting = Exclude<keyof ConfigFromHookResolved, 'Head'>
type HeadSettingFromHook = HeadSetting & keyof ConfigFromHookResolved
function getHeadSetting<T>(headSetting: HeadSetting, pageContext: PageContext & PageContextInternal): undefined | T {
  // Set by useConfig()
  {
    const val = pageContext._configFromHook?.[headSetting as HeadSettingFromHook]
    if (val !== undefined) return val as any
  }

  // Set by +configName.js
  const getCallable = (val: unknown) => (isCallable(val) ? val(pageContext) : val)
  const val = pageContext.config[headSetting]
  if (Array.isArray(val)) return val.map(getCallable) as any // cumulative configs
  return getCallable(val) as any
}
