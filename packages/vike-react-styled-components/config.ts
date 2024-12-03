export { config as default }

import type { IStyleSheetManager, ServerStyleSheet } from 'styled-components'
import type { Config } from 'vike/types'

const config = {
  name: 'vike-react-styled-components',
  require: {
    vike: '>=0.4.203',
    'vike-react': '>=0.4.13',
  },
  onAfterRenderHtml: 'import:vike-react-styled-components/__internal/onAfterRenderHtml:onAfterRenderHtml',
  onBeforeRenderHtml: 'import:vike-react-styled-components/__internal/onBeforeRenderHtml:onBeforeRenderHtml',
  Wrapper: 'import:vike-react-styled-components/__internal/Wrapper:Wrapper',
  meta: {
    styledComponents: {
      env: {
        server: true,
        client: false,
      },
    },
  },
} satisfies Config

declare global {
  namespace Vike {
    interface PageContext {
      styledComponentsSheet?: ServerStyleSheet
    }
    interface Config {
      styledComponents?: null | {
        styleSheetManager?: Omit<IStyleSheetManager, 'sheet' | 'children'>
      }
    }
  }
}
