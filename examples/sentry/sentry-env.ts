export const release = 'vike-react-sentry-example@0.0.0'
// Set only by the e2e lane that passes the DSN through +sentry instead of PUBLIC_ENV__SENTRY_DSN
export const dsn: string | undefined = import.meta.env.PUBLIC_ENV__FACTORY_DSN
