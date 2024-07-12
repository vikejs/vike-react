export function isReactElement(value: ReactElement | ReactComponent): value is ReactElement {
  return (
    typeof value === 'object' &&
    value !== null &&
    String((value as any as Record<string, unknown>)['$$typeof']) === 'Symbol(react.element)'
  )
}
type ReactElement = React.ReactNode
type ReactComponent = () => ReactElement
