export { config }

import type { Config, ConfigEffect } from 'vike/types'
// Load global interfaces whenever the user `import vikeReact from 'vike-react'`
import './types/index.js'

const config = {
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
      env: { server: true, client: true }
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
    VikeReactQueryWrapper: {
      env: { client: true, server: true }
    },
    Wrapper: {
      env: { client: true, server: true }
    }
  }
} satisfies Config

function ssrEffect({ configDefinedAt, configValue }: Parameters<ConfigEffect>[0]): ReturnType<ConfigEffect> {
  if (typeof configValue !== 'boolean') {
    throw new Error(`${configDefinedAt} should be a boolean`)
  }

  return {
    meta: {
      Page: {
        env: {
          // Always load `Page` on the client-side.
          client: true,
          // When the SSR flag is false, we want to render the page only on the client-side.
          // We achieve this by loading `Page` only on the client-side: when onRenderHtml()
          // gets a `Page` value that is undefined it skip server-side rendering.
          server: configValue !== false
        }
      }
    }
  }
}

function isNotFalse<T>(val: T | false): val is T {
  return val !== false
}
