export { getHeadSetting }

import { isCallable } from '../utils/isCallable.js'
import type { PageContext } from 'vike/types'
import type { PageContextInternal } from '../types/PageContext.js'
import type { ConfigViaHookResolved } from '../types/Config.js'
import { configsCumulative } from '../hooks/useConfig/configsCumulative.js'
import { includes } from '../utils/includes.js'

// We use `any` instead of doing proper validation in order to save KBs sent to the client-side.

function getHeadSetting<T>(
  configName: keyof ConfigViaHookResolved,
  pageContext: PageContext & PageContextInternal,
): undefined | T {
  // Set by useConfig()
  const valFromUseConfig = pageContext._configViaHook?.[configName]
  // Set by +configName.js
  const valFromConfig = pageContext.config[configName]

  const getCallable = (val: unknown) => (isCallable(val) ? val(pageContext) : val)
  if (!includes(configsCumulative, configName)) {
    if (valFromUseConfig !== undefined) return valFromUseConfig as any
    return getCallable(valFromConfig) as any
  } else {
    return [
      //
      ...((valFromConfig as any) ?? []).map(getCallable),
      ...((valFromUseConfig as any) ?? []),
    ] as any
  }
}
