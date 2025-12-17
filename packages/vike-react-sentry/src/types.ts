import type * as SentryReact from '@sentry/react'
import type * as SentryNode from '@sentry/node'
import type { SentryVitePluginOptions } from '@sentry/vite-plugin'

export interface SentryNodeOptions extends SentryNode.NodeOptions {}
export interface SentryReactOptions extends SentryReact.BrowserOptions {}
export type SentryOptions = Pick<
  SentryNodeOptions & SentryReactOptions,
  | 'dsn'
  | 'environment'
  | 'release'
  | 'debug'
  | 'sampleRate'
  | 'tracesSampleRate'
  | 'enabled'
  | 'maxBreadcrumbs'
  | 'sendDefaultPii'
> & {
  vite?: SentryVitePluginOptions
}
