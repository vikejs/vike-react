export { Page }

import { usePageContext } from 'vike-react/usePageContext'

function Page() {
  const { is404 } = usePageContext()
  return <h1>{is404 ? 'Page Not Found' : 'Internal Error'}</h1>
}
