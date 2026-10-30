export { isReactElement }

import type React from 'react'
import { isCallable } from './isCallable.js'
import { isObject } from './isObject.js'

function isReactElement(value: ReactElement | ReactComponent): value is ReactElement {
  return !isCallable(value) && !isMemoOrForwardRef(value)
}
// React.memo() and React.forwardRef() return components that are objects
function isMemoOrForwardRef(value: unknown): boolean {
  const $$typeof = isObject(value) && value.$$typeof
  return $$typeof === Symbol.for('react.memo') || $$typeof === Symbol.for('react.forward_ref')
}
type ReactElement = React.ReactNode
type ReactComponent = () => ReactElement
