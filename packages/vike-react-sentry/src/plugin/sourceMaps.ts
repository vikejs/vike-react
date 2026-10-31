export { sourceMapsPlugin }

import { sentryVitePlugin, type SentryVitePluginOptions } from '@sentry/vite-plugin'
import { getVikeConfig } from 'vike/plugin'
import { loadEnv, type Plugin } from 'vite'
import { assertWarning } from '../utils/assert.js'

type Env = Record<string, string | undefined>

/** Uploads source maps at `vike build` when an auth token is set (`+sentryVite` or `SENTRY_AUTH_TOKEN`). */
function sourceMapsPlugin(): Plugin {
  let sentryPlugins: Plugin[] | undefined
  return {
    name: 'vike-react-sentry:source-maps',
    async config(userConfig, { mode, command }) {
      if (command !== 'build') return
      // Sentry's plugin reads its options from process.env when it's created, which is before Vite loads .env files
      const env = loadEnv(mode, userConfig.envDir || userConfig.root || process.cwd(), ['SENTRY_', 'PUBLIC_ENV__'])
      const options = resolveEnvFallbacks(getVikeConfig().config.sentryVite, env)
      if (!options) return
      sentryPlugins = sentryVitePlugin(await autoDetectProjectInfo(options, env['PUBLIC_ENV__SENTRY_DSN']))
      return { build: { sourcemap: true } }
    },
    applyToEnvironment() {
      return sentryPlugins ?? false
    },
  }
}

/** Resolve env var fallbacks for vite plugin auth/org/project/url. */
function resolveEnvFallbacks(options: SentryVitePluginOptions | undefined, env: Env) {
  const authToken = options?.authToken || env['SENTRY_AUTH_TOKEN']
  if (!authToken) return undefined
  return {
    ...options,
    authToken,
    org: options?.org || env['SENTRY_ORG'],
    project: options?.project || env['SENTRY_PROJECT'],
    url: options?.url || env['SENTRY_URL'],
  }
}

// Vite resolves its config several times per build
let projectInfoPromise: ReturnType<typeof getProjectInfoFromApi> | undefined

/** Auto-detect project and org slug from Sentry API when not explicitly configured. */
async function autoDetectProjectInfo(
  options: SentryVitePluginOptions,
  dsn: string | undefined,
): Promise<SentryVitePluginOptions> {
  if (options.project || options.org || !dsn) return options
  const authToken = options.authToken
  const projectId = getProjectIdFromDsn(dsn)
  if (!authToken || !projectId) return options

  projectInfoPromise ??= getProjectInfoFromApi(authToken, projectId, dsn, options.url)
  const projectInfo = await projectInfoPromise
  if (!projectInfo) return options

  return {
    ...options,
    project: projectInfo.projectSlug,
    org: projectInfo.orgSlug,
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

/** Fetch project and org slug from Sentry API. */
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
      assertWarning(
        false,
        `Failed to auto-detect Sentry project info from API (url: ${effectiveUrl}, status: ${response.status}): set SENTRY_ORG and SENTRY_PROJECT`,
      )
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
  } catch (err) {
    assertWarning(
      false,
      `Failed to auto-detect Sentry project info from API (url: ${effectiveUrl}, projectId: ${projectId}): ${err}`,
    )
    return null
  }
}
