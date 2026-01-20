export function resolveDsn(configDsn: string | undefined): string | undefined {
  return configDsn || import.meta.env.PUBLIC_ENV__SENTRY_DSN
}
