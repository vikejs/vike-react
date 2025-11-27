export { config as default }

import type { Config } from 'vike/types'
import type * as SentryReact from '@sentry/react'
import type * as SentryNode from '@sentry/node'
import type { SentryVitePluginOptions } from '@sentry/vite-plugin'
import { vikeReactSentry} from '../plugin/index.js'

import 'vike-react/config'

const config = {
  name: 'vike-react-sentry',
  require: {
    'vike-react': '>=0.6.4',
  },
  Head: 'import:vike-react-sentry/__internal/integration/Head:Head',
  onCreateGlobalContext: 'import:vike-react-sentry/__internal/integration/onCreateGlobalContext:onCreateGlobalContext',
  onError: 'import:vike-react-sentry/__internal/integration/onError:onError',
  meta: {
    sentry: {
      env: {
        server: true,
        client: true,
        config: true,
      },
      global: true
    },
  },
  vite: {
    plugins: [vikeReactSentry()],
  },
} satisfies Config

export interface SentryCommonOptions {
  /** Sentry DSN (Data Source Name) */
  dsn?: string
  /** Environment name (e.g., 'production', 'development') */
  environment?: string
  /** Release version identifier */
  release?: string
  /** Enable debug mode */
  debug?: boolean
  /** Sample rate for error events (0.0 to 1.0) */
  sampleRate?: number
  /** Sample rate for performance tracing (0.0 to 1.0) */
  tracesSampleRate?: number
  /** Enable or disable Sentry */
  enabled?: boolean
  /** Maximum number of breadcrumbs */
  maxBreadcrumbs?: number
  /** Send default PII (Personally Identifiable Information) */
  sendDefaultPii?: boolean
}

export interface SentryConfig extends SentryCommonOptions {
  /** Sentry configuration for the client (browser) */
  client?: SentryReact.BrowserOptions

  /** Sentry configuration for the server (Node.js) */
  server?: SentryNode.NodeOptions

  /** Sentry Vite plugin configuration for sourcemap upload */
  vitePlugin?: SentryVitePluginOptions
}

declare global {
  namespace Vike {
    interface Config {
      /** Sentry configuration for client, server, and build-time */
      sentry?: SentryConfig
    }
  }
}

