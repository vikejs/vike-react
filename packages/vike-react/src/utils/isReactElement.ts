export { isReactElement }

import React, { isValidElement } from 'react'

function isReactElement(value: ReactElement | ReactComponent): value is ReactElement {
  return isValidElement(value) || Array.isArray(value)
}
type ReactElement = React.ReactNode
type ReactComponent = () => ReactElement
