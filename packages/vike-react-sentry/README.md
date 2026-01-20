<!-- WARNING: keep links absolute in this file so they work on NPM too -->

[![npm version](https://img.shields.io/npm/v/vike-react-sentry)](https://www.npmjs.com/package/vike-react-sentry)

# `vike-react-sentry`

Integrates [Sentry](https://sentry.io) error tracking and performance monitoring into your [`vike-react`](https://vike.dev/vike-react) app.

Features:
- Browser and server error tracking
- Performance monitoring and tracing
- Automatic source map upload
- Works out of the box with minimal configuration

<br/>

**Table of Contents**

[Installation](#installation)  
[Basic usage](#basic-usage)  
[Example](#example)  
[Customization](#customization)  
[Settings](#settings)  
[Version history](#version-history)  
[See also](#see-also)  

<br/>

## Installation

1. `npm install vike-react-sentry @sentry/react @sentry/node @sentry/vite-plugin`
2. Extend `+config.js`:
   ```js
   // pages/+config.js

   import vikeReact from 'vike-react/config'
   import vikeReactSentry from 'vike-react-sentry/config'

   export default {
     // ...
     extends: [vikeReact, vikeReactSentry]
   }
   ```
3. Add environment variables to your `.env` file:
   ```bash
   # Required: Your Sentry DSN (public, safe to expose to the browser)
   PUBLIC_ENV__SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

   # Required for source map upload: Sentry Auth Token
   # Create at https://sentry.io/settings/account/api/auth-tokens/
   # Required scopes: project:read, project:releases, project:write
   SENTRY_AUTH_TOKEN=sntryu_xxxxx
   ```

> [!NOTE]
> The `vike-react-sentry` extension requires [`vike-react`](https://vike.dev/vike-react).

<br/>

## Basic usage

That's it! With the configuration above, `vike-react-sentry` will automatically:
- Initialize Sentry on both client and server
- Track errors and exceptions
- Instrument Vike hooks using [onHookCall](https://vike.dev/onHookCall)
- Enable browser tracing for performance monitoring
- Upload source maps during production builds (when `SENTRY_AUTH_TOKEN` is set)

You can optionally configure Sentry options in your `+config.js`:

```js
// pages/+config.js

export default {
  sentry: {
    tracesSampleRate: 1.0,  // Capture 100% of transactions for tracing
    debug: true,            // Enable debug mode during development
  }
}
```

<br/>

## Example

See [examples/sentry](https://github.com/vikejs/vike-react/tree/main/examples/sentry) for a full working example.

<br/>

## Customization

For advanced customization, you can create Sentry configuration files:

### `+sentry.js` (shared configuration)

```js
// pages/+sentry.js
// Environment: client, server

export default (globalContext) => ({
  tracesSampleRate: 1.0,
  environment: globalContext.isProduction ? 'production' : 'development',
})
```

### `+sentry.client.js` (client-only configuration)

```js
// pages/+sentry.client.js
// Environment: client

export default (globalContext) => ({
  // Client-specific integrations
  integrations: [
    // Add custom browser integrations here
  ],
})
```

### `+sentry.server.js` (server-only configuration)

```js
// pages/+sentry.server.js
// Environment: server

export default (globalContext) => ({
  // Server-specific integrations
  integrations: [
    // Add custom Node.js integrations here
  ],
})
```

<br/>

## Settings

### `sentry`

Sentry SDK configuration options shared between client and server:

```ts
interface SentryOptions {
  dsn?: string              // Sentry DSN (can also use PUBLIC_ENV__SENTRY_DSN env var)
  environment?: string      // Environment name (e.g., 'production', 'staging')
  release?: string          // Release version
  debug?: boolean           // Enable debug mode
  sampleRate?: number       // Error sample rate (0.0 to 1.0)
  tracesSampleRate?: number // Transaction sample rate (0.0 to 1.0)
  enabled?: boolean         // Enable/disable Sentry
  maxBreadcrumbs?: number   // Maximum number of breadcrumbs
  sendDefaultPii?: boolean  // Send default PII data
}
```

### `sentryVite`

Sentry Vite plugin configuration for source map upload. This is automatically configured when `SENTRY_AUTH_TOKEN` is set, but can be customized:

```js
// pages/+config.js

export default {
  sentryVite: {
    authToken: process.env.SENTRY_AUTH_TOKEN,  // Auto-detected from env
    org: 'your-org',                           // Auto-detected from DSN
    project: 'your-project',                   // Auto-detected from DSN
    // ... other @sentry/vite-plugin options
  }
}
```

> [!NOTE]
> When using a **personal auth token** with `SENTRY_AUTH_TOKEN`, `org` and `project` are automatically detected from your DSN using the Sentry API. Organization-scoped tokens don't support the required API permissions, so you'll need to set `SENTRY_PROJECT` manually if using those.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `PUBLIC_ENV__SENTRY_DSN` | Your Sentry DSN (required). Public and safe for browser. |
| `SENTRY_AUTH_TOKEN` | Auth token for source map upload. Create at [Sentry Auth Tokens](https://sentry.io/settings/auth-tokens/). Required scopes: `project:read`, `project:releases`, `project:write`. |
| `SENTRY_ORG` | Organization slug (optional, auto-detected from DSN). |
| `SENTRY_PROJECT` | Project slug (optional, auto-detected from DSN). |
| `SENTRY_URL` | Custom Sentry URL for self-hosted instances. |

<br/>

## Version history

See [CHANGELOG.md](https://github.com/vikejs/vike-react/blob/main/packages/vike-react-sentry/CHANGELOG.md).

<br/>

## See also

- [Sentry Documentation](https://docs.sentry.io/)
- [Sentry React SDK](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry Node SDK](https://docs.sentry.io/platforms/javascript/guides/node/)
- [Vike Documentation](https://vike.dev)
- [`vike-react`](https://github.com/vikejs/vike-react/tree/main/packages/vike-react#readme)
