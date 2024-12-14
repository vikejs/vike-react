export { config as default }

import type { Config } from 'vike/types'
import type { StyledJsxStyleRegistry } from 'styled-jsx'

const config = {
  name: 'vike-react-styled-jsx',
  require: {
    vike: '>=0.4.203',
    'vike-react': '>=0.4.13',
  },
  onAfterRenderHtml: 'import:vike-react-styled-jsx/__internal/onAfterRenderHtml:onAfterRenderHtml',
  Wrapper: 'import:vike-react-styled-jsx/__internal/Wrapper:Wrapper',
  meta: {
    styledJsx: {
      env: { server: true },
    },
  },
} satisfies Config

declare global {
  namespace Vike {
    interface PageContext {}
    interface Config {
      styledJsx?: StyledJsxStyleRegistry | null
    }
  }
}
