import { PageContextClient } from 'vike/types'
import { ReactOptions } from '../types/Config.js'
import { isCallable } from '../utils/isCallable.js'
import { objectEntries } from '../utils/objectEntries.js'

export { resolveReactOptions }

function resolveReactOptions(pageContext: PageContextClient) {
  const optionsAcc: ReactOptions = {}
  ;(pageContext.config.react ?? []).forEach((valUnresolved) => {
    const optionList = isCallable(valUnresolved) ? valUnresolved(pageContext) : valUnresolved
    if (!optionList) return
    objectEntries(optionList).forEach(([fnName, options]) => {
      if (!options) return
      if (!optionList[fnName]) return
      optionsAcc[fnName] ??= {}
      objectEntries(optionList[fnName]).forEach(([key, val]) => {
        if (!isCallable(val)) {
          // @ts-ignore
          optionsAcc[fnName][key] ??= val
        } else {
          ;(options[key] as Function | undefined) = (...args: unknown[]) => {
            ;(options[key] as Function | undefined)?.(...args)
            // @ts-ignore
            val(...args)
          }
        }
      })
    })
  })
  return optionsAcc
}
