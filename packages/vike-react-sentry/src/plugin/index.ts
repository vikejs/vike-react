export { vikeReactSentry }

import { sentryVitePlugin } from '@sentry/vite-plugin'
import { serverProductionEntryPlugin } from '@brillout/vite-plugin-server-entry/plugin'
import { getVikeConfig } from 'vike/plugin'
import type { Plugin } from 'vite'
import type { SentryConfig } from '../integration/+config.js'

// Return `PluginInterop` instead of `Plugin` to avoid type mismatch upon different Vite versions
const vikeReactSentry = async () => {
  const plugins: Plugin[] = []

  // Wait for vike config to be available
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Get sentry config from vike config
  const vikeConfig = getVikeConfig()
  const sentryConfig = vikeConfig.config.sentry as SentryConfig | undefined

  const { client, server, vitePlugin, ...commonOptions } = sentryConfig || {}
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

  if (vitePluginOptions) {
    const sentryPlugins = sentryVitePlugin(vitePluginOptions)
    plugins.push(...sentryPlugins)
  }

  plugins.push(
    ...serverProductionEntryPlugin({
      getServerProductionEntry: () => {
        return `
// vike-react-sentry: Preload OpenTelemetry instrumentation for ESM
// This runs before the main server entry to enable monkey-patching of libraries
// The actual Sentry.init() with config will be called later via onCreateGlobalContext
// https://docs.sentry.io/platforms/javascript/guides/node/install/esm-without-import/
import { preloadOpenTelemetry } from '@sentry/node';
preloadOpenTelemetry();
`
      },
      libraryName: 'vike-react-sentry',
    }),
  )

  return plugins
}
