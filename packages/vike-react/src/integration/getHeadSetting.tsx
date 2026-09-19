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
  const valFromHook = pageContext._configViaHook?.[configName]
  // Set by +configName.js
  const valFromConfig = pageContext.config[configName]

  const getCallable = (val: unknown) => (isCallable(val) ? val(pageContext) : val)
  if (!includes(configsCumulative, configName)) {
    if (valFromHook !== undefined) return valFromHook as any
    return getCallable(valFromConfig) as any
  } else {
    // Sorted by increasing precedence: the values set by Vike extensions come first, then the app's values (the most
    // specific one last), then the values set by useConfig(). Merging the list in order (e.g. with Object.assign())
    // thus yields the value with the highest precedence.
    return [
      // pageContext.config[configName] is sorted by decreasing precedence (the most specific value first, the values set
      // by Vike extensions last) => we reverse it. (We copy the list first: pageContext.config is shared.)
      ...[...((valFromConfig as any) ?? [])].reverse().map(getCallable),
      ...((valFromHook as any) ?? []),
    ] as any
  }
}
