# Vike + React + Sentry Example

This example demonstrates how to integrate Sentry error tracking with a Vike + React application using [`vike-react-sentry`](https://github.com/vikejs/vike-react/tree/main/packages/vike-react-sentry).

## Features

- Client-side error tracking
- Server-side error tracking
- Performance monitoring and tracing
- Source map uploads for production debugging

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy `.env.example` to `.env` and fill in your Sentry DSN:

```bash
cp .env.example .env
```

3. Run development server:

```bash
pnpm dev
```

4. Build for production (source maps are uploaded when `SENTRY_AUTH_TOKEN` is set):

```bash
pnpm build
pnpm prod
```

## Configuration

The Sentry DSN and auth token are configured via environment variables in `.env`:

```bash
PUBLIC_ENV__SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_AUTH_TOKEN=sntryu_xxxxx
```

You can optionally customize Sentry SDK options in `pages/+config.ts`:

```ts
export default {
  sentry: {
    tracesSampleRate: 1.0,
    debug: true
  }
}
```

See the [`vike-react-sentry` README](https://github.com/vikejs/vike-react/tree/main/packages/vike-react-sentry) for all available options.

## Learn More

- [Vike Documentation](https://vike.dev)
- [Sentry Documentation](https://docs.sentry.io)
