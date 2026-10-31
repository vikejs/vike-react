import type * as SentryReact from '@sentry/react'
import type * as SentryNode from '@sentry/node'
import type { GlobalContext } from 'vike/types'

export interface SentryNodeOptions extends SentryNode.NodeOptions {}
export interface SentryReactOptions extends SentryReact.BrowserOptions {}
export type SentryOptions = SentryNodeOptions | SentryReactOptions
export type SentryOptionsFactory = (globalContext: GlobalContext) => SentryOptions | Promise<SentryOptions>
