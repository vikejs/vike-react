# Vike + React + Sentry Example

This example demonstrates how to integrate Sentry error tracking with a Vike + React application.

## Features

- ✅ Client-side error tracking
- ✅ Server-side error tracking
- ✅ Automatic error boundaries
- ✅ Distributed tracing (server → client)
- ✅ Source map uploads for production debugging

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Configure Sentry DSN in `pages/+config.ts`

3. Run development server:

```bash
pnpm dev
```

4. Build for production:

```bash
pnpm build
pnpm prod
```

## Configuration

Edit `pages/+config.ts` to configure Sentry options:

```typescript
sentry: {
  dsn: 'YOUR_SENTRY_DSN',
  environment: 'production',
  client: {
    // Client-specific options
  },
  server: {
    // Server-specific options
  },
  vitePlugin: {
    // Sourcemap upload options
    org: 'your-org',
    project: 'your-project',
    authToken: process.env.SENTRY_AUTH_TOKEN
  }
}
```

## Learn More

- [Vike Documentation](https://vike.dev)
- [Sentry Documentation](https://docs.sentry.io)
