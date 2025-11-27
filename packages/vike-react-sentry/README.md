# vike-react-sentry

Full-featured Sentry integration for `vike-react`.

[Installation](#installation)
[Configuration](#configuration)
[Features](#features)

## Installation

1. Install dependencies:
   ```bash
   pnpm add @sentry/react @sentry/node @sentry/vite-plugin vike-react-sentry
   ```

2. Extend `+config.js`:
   ```js
   // pages/+config.js

   import vikeReact from 'vike-react/config'
   import vikeReactSentry from 'vike-react-sentry/config'

   export default {
     extends: [vikeReact, vikeReactSentry]
   }
   ```

3. Configure Sentry in `+sentry.js` (or in `+config.js`):
   ```js
   // pages/+sentry.js

   export default {
     // Common options (applied to both client and server)
     dsn: 'your-sentry-dsn',
     environment: import.meta.env.MODE,
     tracesSampleRate: 1.0,

     // Client-specific options
     client: {
       // Optional: Configure which domains should receive trace headers
       tracePropagationTargets: ['localhost', /^https:\/\/yourapi\.com/],
     },

     // Server-specific options (optional)
     server: {
       // Add server-specific overrides here if needed
     }
   }
   ```

That's it! Distributed tracing, error monitoring, and sourcemap upload are all configured automatically.

### Common Options

You can specify common options at the root level that will be applied to both client and server:

- `dsn` - Sentry DSN (Data Source Name)
- `environment` - Environment name (e.g., 'production', 'development')
- `release` - Release version identifier
- `debug` - Enable debug mode
- `sampleRate` - Sample rate for error events (0.0 to 1.0)
- `tracesSampleRate` - Sample rate for performance tracing (0.0 to 1.0)
- `enabled` - Enable or disable Sentry
- `maxBreadcrumbs` - Maximum number of breadcrumbs
- `sendDefaultPii` - Send default PII (Personally Identifiable Information)

Client and server specific options will override common options.

## Configuration

### `sentry.client`

Client-side (browser) Sentry configuration. Can be an object or a function that receives `pageContext`:

```js
// Static configuration
export default {
  sentry: {
    client: {
      dsn: 'your-sentry-dsn',
      environment: 'production',
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    }
  }
}

// Dynamic configuration
export default {
  sentry: {
    client: (pageContext) => ({
      dsn: 'your-sentry-dsn',
      environment: pageContext.config.environment,
      user: pageContext.user,
    })
  }
}
```

See [Sentry React documentation](https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/) for all available options.

### `sentry.server`

Server-side (Node.js) Sentry configuration. Can be an object or a function that receives `pageContext`:

```js
export default {
  sentry: {
    server: {
      dsn: 'your-sentry-dsn',
      environment: 'production',
      tracesSampleRate: 1.0,
    }
  }
}
```

See [Sentry Node.js documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/) for all available options.

### Vite Plugin (Sourcemap Upload)

The Sentry Vite plugin handles automatic sourcemap upload during build. Configure it in your `+sentry.js` or `+config.js`:

```js
// pages/+sentry.js

export default {
  client: {
    dsn: 'your-sentry-dsn',
    environment: import.meta.env.MODE,
  },
  server: {
    dsn: 'your-sentry-dsn',
    environment: import.meta.env.MODE,
  },
  vitePlugin: {
    org: 'your-org',
    project: 'your-project',
    authToken: process.env.SENTRY_AUTH_TOKEN,
    // Optional: additional configuration
    sourcemaps: {
      assets: './dist/**',
    },
  }
}
```

The Vite plugin is **automatically added** when you configure `sentry.vitePlugin` in your Sentry config. The plugin reads the configuration from your `+sentry.js` or `+config.js` file, so you don't need to manually add it to `vite.config.js`.

See [Sentry Vite Plugin documentation](https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/vite/) for all available options.

## Distributed Tracing

This extension **automatically enables distributed tracing** between client and server out of the box! No additional configuration required.

### How It Works

1. **Client → Server**: When the client makes HTTP requests, trace headers (`sentry-trace` and `baggage`) are automatically attached
2. **Server Processing**: The middleware extracts these headers and continues the trace on the server
3. **Server → Client**: The server injects trace meta tags into the HTML, allowing the client to continue the trace after hydration

The `browserTracingIntegration()` is **enabled by default**, so distributed tracing works immediately after installation.

### Optional Configuration

You can customize trace propagation targets to control which domains receive trace headers:

```js
// pages/+sentry.js
export default {
  client: {
    dsn: 'your-sentry-dsn',
    tracesSampleRate: 1.0,
    // Optional: Configure which domains should receive trace headers
    // By default, traces are sent to same-origin requests
    tracePropagationTargets: [
      'localhost',
      /^https:\/\/yourapi\.com/,
      /^https:\/\/yourdomain\.com/,
    ],
  },
  server: {
    dsn: 'your-sentry-dsn',
    tracesSampleRate: 1.0,
  }
}
```

### Custom Integrations

If you need to customize integrations, set `integrations` to an empty array in your config to disable defaults, then configure them in a separate `+integrations.client.ts` file:

```js
// pages/+sentry.js
export default {
  client: {
    dsn: 'your-sentry-dsn',
    integrations: [], // Disable default integrations
  }
}
```

```ts
// pages/+integrations.client.ts
import * as Sentry from '@sentry/react'

// Configure custom integrations
Sentry.getClient()?.addIntegration(Sentry.browserTracingIntegration())
Sentry.getClient()?.addIntegration(Sentry.replayIntegration())
```

> **Note**: The default `browserTracingIntegration()` is only added if you don't specify `integrations` in your config. If you set `integrations` (even to an empty array), you're responsible for adding all integrations you need.

**Important**: Make sure your server allows the `sentry-trace` and `baggage` headers in CORS configuration if your client and server are on different domains.

## Features

- **Distributed Tracing**: Automatic trace propagation between client and server (enabled by default)
- **Browser Tracing**: `browserTracingIntegration()` enabled by default for performance monitoring
- Early client-side initialization (before React renders)
- Client-side error monitoring with React Error Boundary
- Server-side error monitoring with onError hook
- Automatic request isolation
- Automatic sourcemap upload during build
- Request context tracking on the server
- Support for both static and dynamic configuration
- TypeScript support
- Zero-config setup - works out of the box

## How It Works

### Client-Side

1. **Early Initialization**: Sentry is initialized at the **top level** of the `+client.ts` module, **before any React code runs**, ensuring all errors are captured from the very beginning. The configuration is exposed via a virtual module that reads from your `+sentry.js` config.
2. **Error Boundary**: The `Wrapper` component wraps your app with `Sentry.ErrorBoundary` to catch React component errors
3. **Static Configuration Only**: Client-side initialization only supports static configuration objects. Dynamic configuration (functions) is not supported for early initialization since `pageContext` is not available at module load time.

### Server-Side

1. **Global Initialization**: Sentry is initialized once when the server starts via the `onCreateGlobalContext` hook
2. **Trace Extraction**: Middleware extracts `sentry-trace` and `baggage` headers from incoming requests
3. **Trace Continuation**: Uses `Sentry.continueTrace()` to continue distributed traces from the client
4. **Trace Injection**: The `Head` component injects trace meta tags into HTML for client-side continuation
5. **Error Handling**: The `onError` hook captures all server-side errors and sends them to Sentry
6. **Request Context**: Middleware adds request information (URL, method, headers) to each error report
7. **Request Isolation**: Sentry SDK v10+ automatically isolates error contexts per request

### Session Management

Sentry maintains **separate sessions** for client and server:

- **Server-side**: One Sentry instance per server process, with automatic request isolation
- **Client-side**: One Sentry instance per browser session
- **Linking**: Errors from both environments are sent to the same Sentry project (using the same DSN), allowing distributed tracing and full visibility

### Distributed Tracing Flow

1. **Initial Page Load**: Server starts a new trace and injects it into HTML via `<meta>` tags
2. **Client Hydration**: Client SDK automatically reads the meta tags and continues the server's trace
3. **Client Navigation**: Client starts new traces for each navigation
4. **API Requests**: Client automatically attaches trace headers to requests matching `tracePropagationTargets`
5. **Server Processing**: Server middleware extracts headers and continues the trace
6. **End-to-End Visibility**: View the complete request flow in Sentry's Performance monitoring

### Request Isolation

The middleware adds request context (URL, method, headers) to each server-side request's Sentry scope. Sentry SDK v10+ automatically creates isolated scopes per request, so this context doesn't leak between concurrent requests.

