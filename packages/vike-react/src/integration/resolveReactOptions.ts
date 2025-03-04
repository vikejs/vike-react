export { resolveReactOptions }

import type { PageContext } from 'vike/types'
import type { ReactOptions } from '../types/Config.js'
import { isCallable } from '../utils/isCallable.js'
import { objectEntries } from '../utils/objectEntries.js'

function resolveReactOptions(pageContext: PageContext) {
  const optionsAcc: ReactOptions = {}
  ;(pageContext.config.react ?? []).forEach((valUnresolved) => {
    const optionList = isCallable(valUnresolved) ? valUnresolved(pageContext) : valUnresolved
    if (!optionList) return
    objectEntries(optionList).forEach(([fnName, options]) => {
      if (!options) return
      optionsAcc[fnName] ??= {}
      objectEntries(options).forEach(([key, val]) => {
        if (!isCallable(val)) {
          // @ts-ignore
          optionsAcc[fnName][key] ??= val
        } else {
          const valPrevious = optionsAcc[fnName]![key] as any as Function | undefined
          // @ts-ignore
          optionsAcc[fnName][key] = (...args: unknown[]) => {
            valPrevious?.(...args)
            val(...args)
          }
        }
      })
    })
  })
  return optionsAcc
}
