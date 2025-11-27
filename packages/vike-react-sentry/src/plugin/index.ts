export { vikeReactSentry }

import { sentryVitePlugin } from '@sentry/vite-plugin'
import type { SentryVitePluginOptions } from '@sentry/vite-plugin'
import { getVikeConfig } from 'vike/plugin'
import type { Plugin } from 'vite'
import type { SentryConfig } from '../integration/+config.js'

// Return `PluginInterop` instead of `Plugin` to avoid type mismatch upon different Vite versions
const vikeReactSentry = async () => {
  const plugins: Plugin[] = []

  // Wait for vike config to be available
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Get sentry config from vike config
  const vikeConfig = getVikeConfig({})
  const sentryConfig = vikeConfig.config.sentry as SentryConfig | undefined

  // Extract common options and vitePlugin config
  const { client, server, vitePlugin, ...commonOptions } = sentryConfig || {}

  // Merge common options (like release) into vitePlugin config
  // VitePlugin uses: release (nested as release.name), org, project, authToken, url, debug
  let vitePluginOptions = vitePlugin
  
  if (vitePluginOptions && commonOptions.release) {
    vitePluginOptions = {
      ...vitePluginOptions,
      release: {
        name: commonOptions.release,
        ...vitePluginOptions.release,
      },
    }
  }

  // Add Sentry Vite plugin if options are provided
  // This handles sourcemap upload during build
  // sentryVitePlugin returns an array of plugins
  if (vitePluginOptions) {
    const sentryPlugins = sentryVitePlugin(vitePluginOptions)
    plugins.push(...sentryPlugins)
  }

  return plugins
}
