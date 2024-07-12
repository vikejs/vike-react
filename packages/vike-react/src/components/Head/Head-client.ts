export { Head }

// client-side import
import { useConfig } from '../../hooks/useConfig/useConfig-client.js'

/** React element rendered and appended into &lt;head>&lt;/head> */
function Head({ children }: { children: React.ReactNode }): null {
  const config = useConfig()
  config({ Head: children })
  return null
}
