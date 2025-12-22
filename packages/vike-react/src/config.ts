export { config as default }

import type { Config } from 'vike/types'
import { ssrEffect } from './integration/ssrEffect.js'
import { isNotFalse } from './utils/isNotFalse.js'

const config = {
  // @eject-remove start
  name: 'vike-react',
  require: {
    vike: '>=0.4.250',
  },

  Loading: 'import:vike-react/__internal/integration/Loading:default',

  // https://vike.dev/onRenderHtml
  onRenderHtml: 'import:vike-react/__internal/integration/onRenderHtml:onRenderHtml',
  // https://vike.dev/onRenderClient
  onRenderClient: 'import:vike-react/__internal/integration/onRenderClient:onRenderClient',

  // @eject-remove end
  passToClient: [
    '_configViaHook',
    // https://github.com/vikejs/vike-react/issues/25
    process.env.NODE_ENV !== 'production' && '$$typeof',
  ].filter(isNotFalse),

  // https://vike.dev/clientRouting
  clientRouting: true,
  hydrationCanBeAborted: true,

  // Remove <ClientOnly> children on server
  staticReplace: [
    {
      env: 'server',
      filter: 'vike-react/ClientOnly',
      type: 'call',
      match: {
        function: [
          'import:react/jsx-runtime:jsx',
          'import:react/jsx-runtime:jsxs',
          'import:react/jsx-dev-runtime:jsxDEV',
        ],
        args: { 0: 'import:vike-react/ClientOnly:ClientOnly' },
      },
      remove: { arg: 1, prop: 'children' },
    },
    {
      env: 'server',
      filter: 'vike-react/ClientOnly',
      type: 'call',
      match: {
        function: 'import:react:createElement',
        args: { 0: 'import:vike-react/ClientOnly:ClientOnly' },
      },
      remove: { argsFrom: 2 },
    },
    {
      env: 'server',
      filter: 'vike-react/useHydrated',
      type: 'call',
      match: {
        function: 'import:vike-react/useHydrated:useHydrated',
      },
      replace: { with: false },
    },
  ],

  // https://vike.dev/meta
  meta: {
    Head: {
      env: { server: true },
      cumulative: true,
    },
    Layout: {
      env: { server: true, client: true },
      cumulative: true,
    },
    title: {
      env: { server: true, client: true },
    },
    description: {
      env: { server: true },
    },
    image: {
      env: { server: true },
    },
    viewport: {
      env: { server: true },
    },
    favicon: {
      env: { server: true },
      global: true,
    },
    lang: {
      env: { server: true, client: true },
    },
    bodyHtmlBegin: {
      env: { server: true },
      cumulative: true,
      global: true,
    },
    bodyHtmlEnd: {
      env: { server: true },
      cumulative: true,
      global: true,
    },
    headHtmlBegin: {
      env: { server: true },
      cumulative: true,
      global: true,
    },
    headHtmlEnd: {
      env: { server: true },
      cumulative: true,
      global: true,
    },
    htmlAttributes: {
      env: { server: true },
      global: true,
      cumulative: true, // for Vike extensions
    },
    bodyAttributes: {
      env: { server: true },
      global: true,
      cumulative: true, // for Vike extensions
    },
    ssr: {
      env: { config: true },
      effect: ssrEffect,
    },
    stream: {
      env: { server: true },
      cumulative: true,
    },
    streamIsRequired: {
      env: { server: true },
    },
    onBeforeRenderHtml: {
      env: { server: true },
      cumulative: true,
    },
    onAfterRenderHtml: {
      env: { server: true },
      cumulative: true,
    },
    onBeforeRenderClient: {
      env: { client: true },
      cumulative: true,
    },
    onAfterRenderClient: {
      env: { client: true },
      cumulative: true,
    },
    Wrapper: {
      cumulative: true,
      env: { client: true, server: true },
    },
    // TO-DO/next-major: move to +react.js > strictMode ?
    reactStrictMode: {
      env: { client: true, server: true },
    },
    Loading: {
      env: { server: true, client: true },
    },
    react: {
      cumulative: true,
      env: {},
    },
  },
} satisfies Config
// @eject-remove start

// This is required to make TypeScript load the global interfaces Vike.Config and Vike.PageContext so that they're always loaded: we can assume that the user always imports this file over `import vikeReact from 'vike-react/config'`
import './types/Config.js'
import './types/PageContext.js'
// @eject-remove end
