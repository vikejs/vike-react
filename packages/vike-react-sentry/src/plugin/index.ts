export { getViteConfig }

import { sentryVitePlugin, SentryVitePluginOptions } from '@sentry/vite-plugin'
import { serverProductionEntryPlugin } from '@brillout/vite-plugin-server-entry/plugin'
import { getVikeConfig } from 'vike/plugin'
import type { Plugin, InlineConfig } from 'vite'
import { assertUsage } from '../utils/assert.js'
import { SentryOptions } from '../types.js'

declare global {
  var __vike_react_sentry_vite_options_promise: Promise<SentryVitePluginOptions | undefined> | undefined
}

async function getViteConfig(): Promise<InlineConfig> {
  const plugins: Plugin[] = []
  plugins.push({
    enforce: 'post',
    name: 'vike-react-sentry:config-resolver',
    configResolved() {
      globalThis.__vike_react_sentry_vite_options_promise ??= resolveVitePluginOptions()
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

/** Find the first defined value for a sentry config key. */
function findSentryConfig<K extends keyof SentryOptions>(
  configs: (SentryOptions | Function)[],
  key: K,
): SentryOptions[K] | undefined {
  return configs.find((c): c is SentryOptions => typeof c !== 'function' && !!c[key])?.[key]
}

/** Resolve the effective DSN from sentry configs and env vars. */
function resolveDsn(configs: (SentryOptions | Function)[]): string {
  const dsn = findSentryConfig(configs, 'dsn') || process.env['PUBLIC_ENV__SENTRY_DSN']
  // Assumes the client and server uses the same DSN
  // If different DSNs are needed, we can enable SENTRY_DSN later
  assertUsage(
    !process.env['SENTRY_DSN'],
    'SENTRY_DSN is not supported. Use PUBLIC_ENV__SENTRY_DSN instead, or set dsn in your sentry config.',
  )
  assertUsage(dsn, 'Sentry DSN is required. Set PUBLIC_ENV__SENTRY_DSN env var, or set dsn in the sentry config.')
  return dsn
}

/** Resolve vite plugin options from sentry config, env vars, and API auto-detection. */
async function resolveVitePluginOptions(): Promise<SentryVitePluginOptions | undefined> {
  const vikeConfig = getVikeConfig()
  const sentryConfigRaw = vikeConfig.config.sentry || []

  const dsn = resolveDsn(sentryConfigRaw)
  const release = findSentryConfig(sentryConfigRaw, 'release')

  let options = resolveEnvFallbacks(vikeConfig.config.sentryVite)

  if (options && release) {
    options = {
      ...options,
      release: {
        name: release,
        ...options.release,
      },
    }
  }

  if (options) {
    options = await autoDetectProjectInfo(options, dsn)
  }

  return options
}

/** Resolve env var fallbacks for vite plugin auth/org/project/url. */
function resolveEnvFallbacks(
  options: SentryVitePluginOptions | undefined,
): SentryVitePluginOptions | undefined {
  const authToken = options?.authToken || process.env['SENTRY_AUTH_TOKEN']
  if (!authToken) return options
  return {
    ...options,
    authToken,
    org: options?.org || process.env['SENTRY_ORG'],
    project: options?.project || process.env['SENTRY_PROJECT'],
    url: options?.url || process.env['SENTRY_URL'],
  }
}

/** Auto-detect project and org slug from Sentry API when not explicitly configured. */
async function autoDetectProjectInfo(
  options: SentryVitePluginOptions,
  dsn: string,
): Promise<SentryVitePluginOptions> {
  if (options.project || options.org) return options
  const authToken = options.authToken
  const projectId = getProjectIdFromDsn(dsn)
  if (!authToken || !projectId) return options

  const projectInfo = await getProjectInfoFromApi(authToken, projectId, dsn, options.url)
  if (!projectInfo) return options

  return {
    ...options,
    project: projectInfo.projectSlug,
    org: projectInfo.orgSlug,
  }
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
