export { getViteConfig }

import { sentryVitePlugin, SentryVitePluginOptions } from '@sentry/vite-plugin'
import { serverProductionEntryPlugin } from '@brillout/vite-plugin-server-entry/plugin'
import { getVikeConfig } from 'vike/plugin'
import type { Plugin, InlineConfig } from 'vite'
import { assertUsage } from '../utils/assert.js'
import { assignDeep } from '../utils/assignDeep.js'
import { SentryOptions } from '../types.js'

// Cache for auto-detected project info to avoid multiple API calls (global to survive module reloads)
declare global {
  var __vike_react_sentry_vite_options_promise: Promise<SentryVitePluginOptions | undefined> | undefined
}

async function getViteConfig(): Promise<InlineConfig> {
  const plugins: Plugin[] = []
  plugins.push({
    enforce: 'post',
    name: 'vike-react-sentry:config-resolver',
    configResolved() {
      globalThis.__vike_react_sentry_vite_options_promise ??= (async () => {
        const vikeConfig = getVikeConfig()
        const sentryConfigRaw = vikeConfig.config.sentry || []

        const sentryConfig = sentryConfigRaw.toReversed().reduce((acc, curr) => {
          if (typeof curr === 'function') {
            // skip function configs as we don't have access to globalContext here
            curr = {}
          }
          return assignDeep(acc, curr)
        }, {}) as SentryOptions

        assertUsage(
          !process.env['SENTRY_DSN'],
          'SENTRY_DSN is not supported. Use PUBLIC_ENV__SENTRY_DSN instead, or set dsn in your sentry config.',
        )
        const effectiveDsn = sentryConfig.dsn || process.env['PUBLIC_ENV__SENTRY_DSN']
        assertUsage(
          effectiveDsn,
          'Sentry DSN is required. Set PUBLIC_ENV__SENTRY_DSN env var, or set dsn in your sentry config.',
        )

        let vitePluginOptions = vikeConfig.config.sentryVite
        // Resolve env fallbacks for vitePlugin options (effect doesn't have access to .env file vars)
        if (vitePluginOptions || process.env['SENTRY_AUTH_TOKEN']) {
          vitePluginOptions = {
            ...vitePluginOptions,
            authToken: vitePluginOptions?.authToken || process.env['SENTRY_AUTH_TOKEN'],
            org: vitePluginOptions?.org || process.env['SENTRY_ORG'],
            project: vitePluginOptions?.project || process.env['SENTRY_PROJECT'],
            url: vitePluginOptions?.url || process.env['SENTRY_URL'],
          }
        }

        if (vitePluginOptions && sentryConfig.release) {
          vitePluginOptions = {
            ...vitePluginOptions,
            release: {
              name: sentryConfig.release,
              ...vitePluginOptions.release,
            },
          }
        }

        // Auto-detect project and org slug from DSN if not provided
        if (vitePluginOptions && !vitePluginOptions.project && !vitePluginOptions.org) {
          const authToken = vitePluginOptions.authToken
          const sentryUrl = vitePluginOptions.url
          const projectId = getProjectIdFromDsn(effectiveDsn)

          if (authToken && projectId) {
            const projectInfo = await getProjectInfoFromApi(authToken, projectId, effectiveDsn, sentryUrl)
            if (projectInfo) {
              vitePluginOptions = {
                ...vitePluginOptions,
                project: projectInfo.projectSlug,
                org: projectInfo.orgSlug,
              }
            }
          }
        }

        // Cache resolved config globally to make it accessible in onCreateGlobalContext
        return vitePluginOptions
      })()
    },
  })

  if (!globalThis.__vike_react_sentry_vite_options_promise) {
    return {
      plugins,
    }
  }
  const vitePluginOptions = await globalThis.__vike_react_sentry_vite_options_promise
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

  return {
    resolve: {
      noExternal: 'vike-react-sentry',
    },
    plugins,
    ...(vitePluginOptions && {
      build: {
        sourcemap: true,
      },
    }),
  }
}

/** Parse project ID from DSN. Format: https://{PUBLIC_KEY}@{HOST}/{PROJECT_ID} */
function getProjectIdFromDsn(dsn: string): string | undefined {
  const match = dsn.match(/\/(\d+)$/)
  return match?.[1]
}

/**
 * Extract API base URL from DSN
 * DSN host like "o123.ingest.de.sentry.io" -> "https://de.sentry.io"
 */
function getApiUrlFromDsn(dsn: string): string | undefined {
  try {
    const url = new URL(dsn)
    const match = url.hostname.match(/ingest\.(.+)$/)
    return match ? `https://${match[1]}` : undefined
  } catch {
    return undefined
  }
}

/** Fetch project and org slug from Sentry API. Results are cached globally. */
async function getProjectInfoFromApi(
  authToken: string,
  projectId: string,
  dsn: string,
  url?: string,
): Promise<{ projectSlug: string; orgSlug: string } | null> {
  const effectiveUrl = url || getApiUrlFromDsn(dsn) || 'https://sentry.io'

  try {
    const response = await fetch(`${effectiveUrl}/api/0/projects/`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    if (!response.ok) {
      return null
    }
    const projects = (await response.json()) as Array<{
      id: string
      slug: string
      organization: { slug: string }
    }>
    const project = projects.find((p) => p.id === projectId)
    if (!project) {
      return null
    }
    return {
      projectSlug: project.slug,
      orgSlug: project.organization.slug,
    }
  } catch {
    return null
  }
}
