export { Title }

// server-side import
import { useConfig } from '../../hooks/useConfig/useConfig-server.js'
import { renderToStaticMarkup } from 'react-dom/server'

/**
 * ```js
 * <title>${title}</title>
 * <meta property="og:title" content="${title}" />
 * ```
 */
function Title({ children }: { children: React.ReactNode }): null {
  const config = useConfig()
  const title = getString(children)
  config({ title })
  return null
}

function getString(children: React.ReactNode): string {
  return renderToStaticMarkup(children)
}
