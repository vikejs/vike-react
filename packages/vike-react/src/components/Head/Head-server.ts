export { Head }

import { useConfig } from '../../hooks/useConfig/useConfig-server.js'

function Head({ children }: { children: React.ReactNode }): null {
  const config = useConfig()
  config({ Head: children })
  return null
}
