export { getHeadSetting }

import type { PageContext } from 'vike/types'
import { isCallable } from './utils/isCallable.js'
import { PageContextProvider } from './PageContextProvider.js'
import React from 'react'
import assert from 'assert'

function getHeadSetting(headSetting: 'title' | 'favicon' | 'lang', pageContext: PageContext): null | string {
  const config = pageContext.configEntries[headSetting]?.[0]
  if (!config) return null
  const val = config.configValue
  if (typeof val === 'string') return val
  if (!val) return null
  if (isCallable(val)) {
    const valStr = callWithHooks(val, pageContext)

    if (typeof valStr! !== 'string') {
      throw new Error(config.configDefinedAt + ' should return a string')
    }
    return valStr
  } else {
    throw new Error(config.configDefinedAt + ' should be a string or a function returning a string')
  }
}

// TODO: this doesn't work. So far I think it's best we don't do this trick as I can't think of a reliable and straightforward way to make it work.
// Trick to make React hooks available to functions
function callWithHooks(fn: () => unknown, pageContext: PageContext) {
  let valStr: unknown
  let wasCalled = false
  const FunctionCaller = () => {
    wasCalled = true
    // We don't pass pageContext to fn() because usePageContext() provides a better TypeScript DX
    valStr = fn()
    return null
  }
  ;<PageContextProvider pageContext={pageContext}>
    <FunctionCaller />
  </PageContextProvider>
  assert(wasCalled)
  return valStr
}
