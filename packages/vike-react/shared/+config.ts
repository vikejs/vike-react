import type { Config } from 'vike/types'
import { isNotFalse } from './utils/isNotFalse.js'
import { ssrEffect } from './renderer/ssrEffect.js'

// This is required to make TypeScript load the global interfaces such as Vike.PageContext so that they're always loaded: we can assume that the user always imports this file over `import vikeReact from 'vike-react/config'`
import './types/index.js'

export default {
  name: 'vike-react',
  require: {
    vike: '>=0.4.173'
  },

  // https://vike.dev/onRenderHtml
  onRenderHtml: 'import:vike-react/renderer/onRenderHtml:onRenderHtml',
  // https://vike.dev/onRenderClient
  onRenderClient: 'import:vike-react/renderer/onRenderClient:onRenderClient',

  passToClient: [
    // https://github.com/vikejs/vike-react/issues/25
    process.env.NODE_ENV !== 'production' && '$$typeof'
  ].filter(isNotFalse),

  // https://vike.dev/clientRouting
  clientRouting: true,
  hydrationCanBeAborted: true,

  // https://vike.dev/meta
  meta: {
    Head: {
      env: { server: true }
    },
    Layout: {
      env: { server: true, client: true },
      cumulative: true
    },
    title: {
      env: { server: true, client: true }
    },
    favicon: {
      env: { server: true, client: true }
    },
    lang: {
      env: { server: true, client: true }
    },
    ssr: {
      env: { config: true },
      effect: ssrEffect
    },
    stream: {
      env: { server: true }
    },
    streamIsRequired: {
      env: { server: true }
    },
    onBeforeRenderClient: {
      env: { client: true }
    },
    onAfterRenderClient: {
      env: { client: true }
    },
    Wrapper: {
      cumulative: true,
      env: { client: true, server: true }
    },
    // Vike already defines the setting 'name', but we redundantly define it here for older Vike versions (otherwise older Vike versions will complain that 'name` is an unknown config). TODO/eventually: remove this once <=0.4.172 versions become rare (also because we use the `require` setting starting from `0.4.173`).
    name: {
      env: { config: true }
    },
    // Vike already defines the setting 'require', but we redundantly define it here for older Vike versions (otherwise older Vike versions will complain that 'require` is an unknown config). TODO/eventually: remove this once <=0.4.172 versions become rare (also because we use the `require` setting starting from `0.4.173`).
    require: {
      env: { config: true }
    },
    reactStrictMode: {
      env: { client: true, server: true }
    }
  }
} satisfies Config
