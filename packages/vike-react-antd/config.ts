export { config as default }

import type { StyleProviderProps } from '@ant-design/cssinjs'
import type { Config } from 'vike/types'

const config = {
  name: 'vike-react-antd',
  require: {
    vike: '>=0.4.203',
    'vike-react': '>=0.4.13',
  },
  onAfterRenderHtml: 'import:vike-react-antd/__internal/onAfterRenderHtml:onAfterRenderHtml',
  onBeforeRenderHtml: 'import:vike-react-antd/__internal/onBeforeRenderHtml:onBeforeRenderHtml',
  Wrapper: 'import:vike-react-antd/__internal/Wrapper:Wrapper',
  meta: {
    Wrapper: {
      env: { server: true },
    },
    antd: {
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
      antd?: {
        cache?: StyleProviderProps['cache']
      }
    }
    interface Config {
      antd?: null | Omit<StyleProviderProps, 'children' | 'cache'>
    }
  }
}
