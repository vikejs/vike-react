export { Head }

// client-side import
import { useConfig } from '../../hooks/useConfig/useConfig-client.js'

function Head({ children }: { children: React.ReactNode }): null {
  const config = useConfig()
  config({ Head: children })
  return null
}
