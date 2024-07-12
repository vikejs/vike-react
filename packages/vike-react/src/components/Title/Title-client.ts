export { Title }

// client-side import
import { useConfig } from '../../hooks/useConfig/useConfig-client.js'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'

/**
 * ```js
 * <title>${title}</title>
 * <meta property="og:title" content="${title}" />
 * ```
 */
function Title({ children }: { children: string }): null {
  const config = useConfig()
  const title = getString(children)
  config({ title })
  return null
}

// https://react.dev/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code
function getString(children: React.ReactNode): string {
  const div = document.createElement('div')
  const root = createRoot(div)
  flushSync(() => {
    root.render(children)
  })
  return div.innerHTML
}
